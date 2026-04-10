import io
import base64
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO('weights/best.pt')

@app.post("/api/detect")
async def detect_objects(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    image_np = np.array(image)
    results = model.predict(source=image_np, conf=0.25)
    annotated_frame = results[0].plot()
    annotated_frame_rgb = cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB)
    _, buffer = cv2.imencode('.jpg', annotated_frame_rgb)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    return {"image_base64": img_base64}