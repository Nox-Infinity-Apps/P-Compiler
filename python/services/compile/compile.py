from typing import Union
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

    async def compile(self, payload, body: CompileBody, id: int) -> Union[CompileResponse, None]:

        result: CompileResponse = CompileResponse(std_out=[], std_err=[], time=[], result=[])

        headers = {
            "x-rapidapi-key": "9489a86ce2msh9b7d4b691f31192p105f19jsnc175be2ee4e",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
        }

        # Lặp qua tất cả các input
        for i in range(len(body.inputs)):
            payload_submit = {
                "language_id": int(id),
                "source_code": body.source_code,
                "stdin": body.inputs[i],
                "expected_output": body.outputs[i],
            }
            print(payload_submit)

            try:
                # Gọi API
                response = submit_client.post("/", headers=headers, json=payload_submit)

                # Kiểm tra mã trạng thái trả về
                if response.status_code == 201:
                    response_data = response.json()
                    print(response_data)

                    # Chỉ gán dữ liệu nếu status là "Accepted"
                    if response_data["status"]["description"] == "Accepted":
                        result.std_out.append(response_data.get("stdout"))
                        result.std_err.append(response_data.get("stderr"))
                        result.time.append(response_data.get("time"))
                        result.result.append(True)
                    elif response_data["status"]["description"] == "Wrong Answer":
                        result.result.append(False)
                else:
                    print(f"Unexpected status code: {response.status_code}")
                    return None

            except HTTPStatusError as e:
                print(f"HTTP error occurred: {e}")
                return None

            except Exception as e:
                print(f"An error occurred: {e}")
                return None

        return result
