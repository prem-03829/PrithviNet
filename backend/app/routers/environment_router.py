from fastapi import APIRouter
from app.services.environment_service import predict_environment
router = APIRouter()
@router.post("/predict")

def predict(data:dict):
    result=predict_environment(
        data["air"],
        data["noise"],
        data["water"]

    )
    return result