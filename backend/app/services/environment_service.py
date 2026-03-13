import joblib
import pandas as pd
from pathlib import Path

# Get backend directory
BASE_DIR = Path(__file__).resolve().parents[2]

# AI models directory
MODEL_DIR = BASE_DIR / "AI_models"

# Load models
air_model = joblib.load(MODEL_DIR / "air_model.pkl")
noise_model = joblib.load(MODEL_DIR / "noise_model.pkl")
water_model = joblib.load(MODEL_DIR / "water_model.pkl")


def predict_environment(air, noise, water):

    air_df = pd.DataFrame([air])
    air_df.rename(columns={"PM2_5": "PM2.5"}, inplace=True)

    noise_df = pd.DataFrame([noise])
    water_df = pd.DataFrame([water])

    air_prediction = float(air_model.predict(air_df)[0])
    noise_prediction = float(noise_model.predict(noise_df)[0])
    water_prediction = float(water_model.predict(water_df)[0])

    return {
        "air_quality_index": air_prediction,
        "noise_level": noise_prediction,
        "water_quality": water_prediction
    }