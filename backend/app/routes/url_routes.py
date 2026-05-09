from fastapi import APIRouter
from pydantic import BaseModel
from app.services.url_analyzer import analyze_url

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post("/analyze-url")
def analyze(request: URLRequest):
    return analyze_url(request.url)