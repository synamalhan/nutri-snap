from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model.detector import detect_food_items
from utils.nutrition_lookup import lookup_nutrition
from typing import Dict
import time
import os
from uuid import uuid4
from shutil import copyfileobj

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/analyze")
async def analyze(image: UploadFile = File(...)) -> Dict:
    try:
        # Save uploaded image
        image_id = f"{uuid4().hex}.jpg"
        image_path = os.path.join(UPLOAD_FOLDER, image_id)
        with open(image_path, "wb") as f:
            copyfileobj(image.file, f)

        # Start timer
        start_time = time.time()

        # Step 1: Detect food items (mocked or actual YOLO)
        detections = detect_food_items(image_path)

        # Step 2: Map to nutrition
        items, total = lookup_nutrition(detections)

        # Step 3: Compute health rating
        rating = "🟢 Healthy" if total["fat"] < 15 and total["calories"] < 600 else "🟡 Moderate"

        return {
            "success": True,
            "data": {
                "items": items,
                "total": total,
                "healthRating": rating,
                "processingTime": round(time.time() - start_time, 2)
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
