from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.media_routes import router as media_router
from app.routes.url_routes import router as url_router
from app.routes.zero_trust_routes import router as zero_trust_router
from app.routes.telemetry_routes import router as telemetry_router

app = FastAPI()
app.include_router(url_router)
app.include_router(zero_trust_router)
app.include_router(telemetry_router, prefix="/api/telemetry")
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




