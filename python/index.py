import time

import schedule
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.index import settings
from routes.index import router
from services.database.database import DatabaseService
from services.mail.mail import EmailService, scheduled_email_task
from utils.env import environment

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# @asynccontextmanager
# async def prisma_starter():
#     if not prisma.is_connected():
#         await prisma.connect()
#
#     yield
#
#     if prisma.is_connected():
#         await prisma.disconnect()


# class PanicHandlerMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request: Request, call_next):
#         try:
#             response = await call_next(request)
#         except Exception as e:
#             return JSONResponse(status_code=500, content={"message": "Internal Server Error"})
#         return response
#
#
#  app.add_middleware(PanicHandlerMiddleware)


app.include_router(router)

# Configuration for SMTP
smtp_config = {
    'server':environment.email_server,
    'port': environment.email_port,
    'password': environment.email_password
}
# Đọc nội dung email từ file
with open('email_template.html', 'r', encoding='utf-8') as file:
    html_content = file.read()
email_service = EmailService(smtp_config)

# Chạy các task theo lịch
schedule.every().day.at("09:00").do(lambda: scheduled_email_task(environment, email_service,html_content))
schedule.every().day.at("00:00").do(lambda:DatabaseService.setKeyAfterDay(environment))

def run_scheduled_tasks():
    while True:
        schedule.run_pending()
        time.sleep(60)

@app.on_event("startup")
async def startup_event():
    import threading
    cron_thread = threading.Thread(target=run_scheduled_tasks, daemon=True)
    cron_thread.start()
if __name__ == "__main__":
    uvicorn.run("index:app", port=environment.port, host=settings.APP_HOST, reload=True, forwarded_allow_ips='*')
