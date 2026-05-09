from fastapi import FastAPI
from app.routes.url_routes import router as url_router
from app.routes.sms_routes import router as sms_router

app = FastAPI()

app.include_router(url_router)
app.include_router(sms_router)

@app.get("/")
def root():
    return {"message": "CipherNet AI Backend Running"}