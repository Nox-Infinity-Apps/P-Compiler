import uuid
from datetime import datetime
from typing import Union, List

import psycopg2
from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from dtos.user.user import UserData, RankData, SubmissionStatistics
from services.database.database import DatabaseService
from services.mail.mail import EmailService, mail_service
from utils.env import Environment
from utils.httpx import cptit_client as cclient

@injectable
class UserService:
    @inject(Environment)
    def __init__(self, env: Environment):
        self.env = env

    def getUserDetail(self,payload) -> Union[UserData, None]:
        response = cclient.get("/user/profile", headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Trích xuất dữ liệu lần lượt theo thứ tự HTML
        username = soup.find('p', class_='profile__name').text.strip() if soup.find('p', class_='profile__name') else ""
        image = soup.find('div', class_='profile__avt').find('img')['src'] if soup.find('div',
                                                                                        class_='profile__avt') else ""

        # Lấy tất cả các thẻ li trong profile
        profile_items = soup.find_all('li', class_='profile__item')

        account = profile_items[1].find('span').text.strip() if profile_items[1].find('span') else ""
        class_ = profile_items[2].find('span').text.strip() if profile_items[2].find('span') else ""
        email = profile_items[3].find('span').text.strip() if profile_items[3].find('span') else ""
        date = profile_items[4].find('span').text.strip() if profile_items[4].find('span') else ""
        gender = profile_items[5].find('span').text.strip() if profile_items[5].find('span') else ""
        location = profile_items[6].find('span').text.strip() if profile_items[6].find('span') else ""
        phone = profile_items[7].find('span').text.strip() if profile_items[7].find('span') else ""
        description = profile_items[8].find('span').text.strip() if profile_items[8].find('span') else ""

        user_data = UserData(username, image, account, class_, email, date, gender, location, phone, description)
        #Insert vào db nếu user chưa tồn tại (không lưu pass đâu nha)
        DatabaseService.addUser(self.env, user_data)
        return user_data

    def getRank(self,course,payload) -> Union[List[RankData], None]:
        # Gọi api lần đầu chuyển course
        _ = cclient.get("student/ranking?course="+course, headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })
        # Gọi api get rank
        response = cclient.get("student/ranking", headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Cookie": payload["cookie"],
        })

        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        # Tìm tất cả các hàng trong bảng
        rows = soup.find_all('tr', class_=['bg--10th', 'bg--20th', 'bg--50th'])
        rows += [
            tr for tr in soup.find_all('tr')
            if tr.find_all('td') and tr.find_all('td')[0].get('class') == ['text--middle']
        ]
        rank_data_list = []
        for row in rows:
            cols = row.find_all('td')
            # Lấy dữ liệu từ các cột
            stt = cols[0].text.strip()  # Cột STT
            image = cols[1].find('img')['src'] if cols[1].find('img') else ""  # Ảnh đại diện
            account = cols[2].text.strip()  # Tài khoản
            userFirstName = cols[3].text.strip()  # Họ
            userLastName = cols[4].text.strip()  # Tên
            course = cols[5].find('p', class_='rank__table__sub').text.strip() if cols[5].find('p',class_='rank__table__sub') else ""  # Khóa học
            class_ = cols[6].text.strip()  # Lớp
            ac = cols[7].text.strip()  # Điểm AC
            tried = cols[8].text.strip()  # Số lần thử

            # Tạo đối tượng RankData
            rank_data = RankData(stt, image, account, userFirstName, userLastName, course, class_, ac, tried)
            rank_data_list.append(rank_data)
        return rank_data_list

    def getStatistics(self,account,payload,from_date,to_date) -> Union[None, SubmissionStatistics,str]:
        try :
            # Chuyển input từ dd/mm/yyyy sang yyyy-mm-dd
            from_date_new = datetime.strptime(from_date, "%d/%m/%Y").strftime('%Y-%m-%d')
            to_date_new = datetime.strptime(to_date, "%d/%m/%Y").strftime('%Y-%m-%d')

            # Lấy userId
            userId = DatabaseService.getUserIdByAccount(self.env, account)
            if userId is None:
                return "Không tìm thấy user"
            # Lấy thống kê theo userId
            res = DatabaseService.getStatistics(self.env, userId, from_date_new, to_date_new)
            return res
        except Exception as e:
            return str(e)

    def sendMail(self,payload):
        try:
            # Gửi mail
            user = self.getUserDetail(payload)
            if user is None:
                return None
            with open('email_template.html', 'r', encoding='utf-8') as file:
                html_content = file.read()
            html_content = html_content.replace("{{URL}}", self.env.url_web)
            mail_service.send_email(
                sender_email=self.env.email_sender,
                receiver_emails=user.email,
                subject=self.env.email_subject,
                body= html_content
            )
            return "Gửi mail thành công"
        except Exception as e:
            return None



