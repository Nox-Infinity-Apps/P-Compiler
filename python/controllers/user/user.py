from common.di.manager import inject
from models.response.template import Success, Failed
from services.history.history import HistoryService
from services.user.user import UserService
from utils.singleton import singleton

@singleton
class UserController:
    @inject(UserService)
    def __init__(self, service: UserService):
        self.service = service

    def getUserDetail(self, payload):
        data = self.service.getUserDetail(payload)
        if data is None:
            return Failed(message="Failed to get user detail")
        return Success(message="Success", data=data)

    def getRank(self,course, payload):
        data = self.service.getRank(course,payload)
        if data is None:
            return Failed(message="Failed to get rank")
        return Success(message="Success", data=data)

    def getStatistics(self,account, payload, from_date, to_date):
        data = self.service.getStatistics(account,payload, from_date, to_date)
        if data is None:
            return Failed(message="Failed to get statistics")
        elif type(data) == str:
            return Failed(message=data)
        return Success(message="Success", data=data)

    def sendMail(self, payload):
        data = self.service.sendMail(payload)
        if data is None:
            return Failed(message="Failed to send mail")
        return Success(message="Success", data=data)

userController = UserController()