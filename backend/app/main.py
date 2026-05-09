from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.url_routes import router as url_router
from app.routes.sms_routes import router as sms_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(url_router)
app.include_router(sms_router)

@app.get("/")
def root():
    return {"message": "CipherNet AI Backend Running"}