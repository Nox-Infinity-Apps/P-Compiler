

from common.di.manager import inject
from models.response.template import Success, Failed
from services.history.history import HistoryService
from utils.singleton import singleton

@singleton
class HistoryController:
    @inject(HistoryService)
    def __init__(self, service: HistoryService):
        self.service = service

    def getAllHistory(self, payload):
        data = self.service.getAllHistory(payload)
        if data is None:
            return Failed(message="Failed to get history data")
        return Success(message="Success", data=data)

    def getHistoryDetail(self, id, payload):
        data = self.service.getHistoryDetail(id, payload)
        if data is None:
            return Failed(message="Failed to get history detail")
        return Success(message="Success", data=data)



historyController = HistoryController()