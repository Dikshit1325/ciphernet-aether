from pydantic import BaseModel

class MediaAnalysisResponse(BaseModel):
    filename: str
    authenticity: int
    clone_probability: int
    deepfake_score: int
    verdict: str
    lip_sync_drift: str
    gan_artifacts: str
    emotional_intent: str