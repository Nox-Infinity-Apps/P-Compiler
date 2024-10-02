from dataclasses import dataclass
from datetime import datetime
from typing import Union, List

from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from dtos.history.history import HistoryData
from utils.env import Environment
from utils.httpx import cptit_client as cclient

@injectable
class HistoryService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def getAllHistory(self,payload) -> Union[List[HistoryData], None]:
        response = cclient.get("/student/history", headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })
        soup = BeautifulSoup(response.text, 'html.parser')
        # Tìm tất cả các hàng <tr> trong tbody
        rows = soup.find_all('tr')

        history_data = []
        for row in rows:
            # Trích xuất các ô <td>
            cols = row.find_all('td')

            # Kiểm tra số lượng cột để tránh lỗi khi số lượng cột không đủ
            if len(cols) < 7:  # Đảm bảo có đủ 7 cột (vì bạn đang truy cập ít nhất 6 cột)
                continue  # Bỏ qua hàng này nếu không đủ cột

            # Lấy dữ liệu từ từng cột
            id_value = cols[0].text.strip() if cols[0].text else None
            date_text = cols[1].find('p', class_='status__table__date').text.strip() if cols[1].find('p',
                                                                                                     class_='status__table__date') else None
            time_text = cols[1].find('p', class_='status__table__time').text.strip() if cols[1].find('p',
                                                                                                     class_='status__table__time') else None
            title = cols[2].find('a').text.strip() if cols[2].find('a') else None
            status = cols[3].find('span').text.strip() if cols[3].find('span').text.strip() else 'N/A'
            run_time = cols[4].text.strip() if cols[4].text.strip() else None
            memory = cols[5].text.strip() if cols[5].text.strip() else None
            compiler = cols[6].text.strip() if cols[6].text else None


            # Tạo đối tượng HistoryData và thêm vào danh sách
            history_data.append(HistoryData(
                id=id_value,
                date=date_text + ' ' + time_text,
                title=title,
                status=status,
                time=run_time,
                capacity=memory,
                compiler=compiler
            ))

        return history_data