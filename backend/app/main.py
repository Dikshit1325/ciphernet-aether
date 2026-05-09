from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.media_routes import router as media_router
from app.routes.url_routes import router as url_router
app = FastAPI()
app.include_router(url_router)
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Routes
app.include_router(media_router)
@app.get("/")
def home():
    return {
        "message": "CipherNet AI Backend Running"
    }




