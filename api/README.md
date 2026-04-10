# 🚀 Bus Stoppage Violation Detection API

This branch contains the **FastAPI** implementation for the Bus Stoppage Violation Detection system using **YOLOv11**.

---

## 📂 API Structure
- `main.py`: The core FastAPI application.
- `requirements.txt`: Dependencies required specifically for the API.
- `temp_uploads/`: Temporary storage for images during processing.

---

## 🛠️ Setup Instructions

To run this API on your local machine, follow these steps:

### 1. Create a Virtual Environment
```bash
python -m venv venv
# Activate on Windows:
venv\Scripts\activate
# Activate on Linux/macOS:
source venv/bin/activate

2. Install API Dependencies
Bash
pip install -r requirements.txt
3. Run the API Server
Ensure your YOLO weights (e.g., best.pt) are in the correct path, then run:

Bash
uvicorn main:app --reload
The server will start at: http://127.0.0.1:8000

🧪 How to Explore & Test the API
Method 1: Interactive Swagger UI (Recommended)
FastAPI provides an automatic documentation interface.

Open your browser and go to: http://127.0.0.1:8000/docs

Look for the POST /predict endpoint.

Click "Try it out", upload a bus/stoppage image, and click Execute.

Method 2: Testing via cURL
You can also test the API from your terminal:

Bash
curl -X 'POST' \
  '[http://127.0.0.1:8000/predict](http://127.0.0.1:8000/predict)' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@your_test_image.jpg'
📊 API Response Example
The API returns a JSON response containing detected objects, confidence scores, and bounding box coordinates:

JSON
{
  "filename": "sample.jpg",
  "detections": [
    {
      "class": "bus",
      "confidence": 0.92,
      "bbox": [x1, y1, x2, y2]
    }
  ],
  "violation_status": "Processing..."
}