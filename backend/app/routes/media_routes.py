from fastapi import APIRouter, UploadFile, File
import os

from app.services.media_service import analyze_uploaded_media
from app.schemas.media_schema import MediaAnalysisResponse

router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post(
    "/analyze-media",
    response_model=MediaAnalysisResponse
)
async def analyze_media(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    result = analyze_uploaded_media(
        file_path,
        file.filename
    )

    return result