
from typing import Union, List

from bs4 import BeautifulSoup

from common.di.manager import injectable, inject
from dtos.user.user import UserData
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

        # Giả sử thứ tự đúng như bạn đã đưa ra trong HTML
        account = profile_items[1].find('span').text.strip() if profile_items[1].find('span') else ""
        class_ = profile_items[2].find('span').text.strip() if profile_items[2].find('span') else ""
        email = profile_items[3].find('span').text.strip() if profile_items[3].find('span') else ""
        date = profile_items[4].find('span').text.strip() if profile_items[4].find('span') else ""
        gender = profile_items[5].find('span').text.strip() if profile_items[5].find('span') else ""
        location = profile_items[6].find('span').text.strip() if profile_items[6].find('span') else ""
        phone = profile_items[7].find('span').text.strip() if profile_items[7].find('span') else ""
        description = profile_items[8].find('span').text.strip() if profile_items[8].find('span') else ""

        # Create UserData instance
        user_data = UserData(username, image, account, class_, email, date, gender, location, phone, description)
        return user_data

