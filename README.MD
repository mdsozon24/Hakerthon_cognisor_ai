# Bus Stoppage Violation Detection System

This repository contains the implementation of an automated system designed to detect bus stoppage violations using the **YOLOv11** object detection model.

## Here is our overall concept Documentation for the project: https://docs.google.com/document/d/1oTI7i5301d6_Z8U2fVw85SksV_lQv04P4eGNrsz2bcc/edit?usp=sharing

---

## 📌 Project Overview

The primary goal of this project is to identify whether a bus is stopping within the designated legal boundary or violating traffic rules by stopping elsewhere. The system processes images/videos from both CCTV and bus-mounted cameras.

- **Model:** YOLOv11 (Ultralytics)
- **Primary Classes:** Bus, Bus Stop, Shelter, Seating, Trash Can.
- **Input:** Images and Video Streams.

---

1.  **Clone the repository**

    ```bash
    git clone https://github.com/mdsozon24/Hakerthon_cognisor_ai.git
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```

    3. **Install dependencies**

    ```bash
    pip install ultralytics opencv-python
    ```

3.  **Run Detection**
    Place your test images in the data/ folder and execute:
    `bash
    python detect.py
    `

        ## 📈 Project Results

    Detailed training logs, confusion matrices, performance graphs, and inference results (output images/videos) are available here:

**Result Folder:** View Project Results on Google Drive
https://drive.google.com/drive/folders/1cOfsSlQ1CPU7GfCY2HVbJsq55K8SVTH3?usp=sharing

## 🛠️ Violation Logic

###### The system utilizes a Region of Interest (ROI) mapping technique:

**Detection:** The model identifies the 'Bus' and the 'Bus Stop' area in real-time.

**Coordinate Analysis:** If the bounding box of the 'Bus' remains stationary for a specific duration outside the designated 'Bus Stop' coordinates, a Violation is triggered and logged automatically.
