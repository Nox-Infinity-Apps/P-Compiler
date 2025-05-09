from typing import Union

import psycopg2
from common.di.manager import injectable, inject
from dtos.compile.compile import CompileResponse, CompileBody
from utils.env import Environment
from utils.httpx import submit_client
from httpx import HTTPStatusError


@injectable
class CompileService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def compile(self, payload, body: CompileBody, id: int) -> Union[CompileResponse, None,str]:
        # print(self.env)
        # Thông tin kết nối tới PostgreSQL
        conn = psycopg2.connect(
            host=self.env.db_postgres_host,
            database=self.env.db_postgres_name,
            user=self.env.db_postgres_user,
            password=self.env.db_postgres_password,
        )

        result: CompileResponse = CompileResponse(std_out=[], std_err=[], time=[], result=[], description=[])
        if(len(body.inputs) > len(body.outputs)):
            return "Số lượng input và output không khớp"
        # Lặp qua tất cả các input
        for i in range(len(body.inputs)):
            # Nếu thành công  thì set= True còn khng sẽ ấy key tiếp theo
            success = False

            while not success:
                # Lấy key chưa hết hạn trong DB
                cur = conn.cursor()
                cur.execute("SELECT key FROM public.\"RapidAPIKey\" WHERE is_expired = false LIMIT 1")
                result_key = cur.fetchone()

                if result_key:
                    api_key = result_key[0]
                    headers = {
                        "x-rapidapi-key": api_key,
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "Content-Type": "application/json",
                    }
                    # print(f"Using Key: {api_key}")
                else:
                    cur.close()
                    conn.close()
                    return "Không còn key hợp lệ"

                # Tạo payload để gửi request
                payload_submit = {
                    "language_id": int(id),
                    "source_code": body.source_code,
                    "stdin": body.inputs[i],
                    "expected_output": body.outputs[i],
                }

                try:
                    # Gọi API
                    response = submit_client.post("/", headers=headers, json=payload_submit)
                    # print(response.status_code)
                    # Kiểm tra mã trạng thái trả về
                    if response.status_code in {200, 201}:
                        response_data = response.json()
                        # print(response_data)
                        result.std_out.append(response_data.get("stdout"))
                        result.std_err.append(response_data.get("stderr"))
                        result.time.append(response_data.get("time"))
                        result.description.append(response_data["status"]["description"])
                        if response_data["status"]["description"] == "Accepted":
                            result.result.append(True)
                        else:
                            result.result.append(False)
                         # Thành công

                        success = True
                    elif response.status_code == 403:
                        result.result.append(False)
                        # Nếu mã trạng thái không phải 200 hoặc 201, cập nhật is_expired thành true
                        cur.execute("UPDATE public.\"RapidAPIKey\" SET is_expired = true WHERE key = %s", (api_key,))
                        conn.commit()
                        # print(f"Mã lỗi: {response.status_code} - Key hết hạn")
                    else:
                        # print(f"Mã lỗi: {response.status_code} - Message: {response.text}")
                        result.result.append(False)
                        result.description.append(response.text)
                        success = True

                except HTTPStatusError as e:
                    return f"Lỗi HTTP: {e}"

                except Exception as e:
                    return f"Có lỗi xảy ra: {e}"

        # Đóng kết nối
        cur.close()
        conn.close()

        return result
