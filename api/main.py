from fastapi import FastAPI, UploadFile, File
import shutil
import os
from ultralytics import YOLO

app = FastAPI()

# Model Path (Apnar path onujayi thik kore nin)
MODEL_PATH = "../../weights/best.pt"
model = YOLO(MODEL_PATH)

@app.get("/")
def home():
    return {"message": "Bus Stoppage Violation Detection API is Running"}

@app.post("/predict")
async def predict_violation(file: UploadFile = File(...)):
    # 1. Save uploaded image temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Run YOLO Detection
    results = model.predict(source=temp_path, save=False)
    
    # 3. Process results
    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist()
            })
    
    # Clean up temp file
    os.remove(temp_path)
    
    return {
        "filename": file.filename,
        "detections": detections,
        "violation_status": "Logic to be implemented based on ROI"
    }
    