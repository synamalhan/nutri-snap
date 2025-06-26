from ultralytics import YOLO
import cv2

# Load the pretrained YOLOv8 model (change path if using custom weights)
model = YOLO("nutrisnap.pt")  # or 'yolov8n-food.pt' if trained on Food101

# Optional: Define label map if using a custom dataset
# You can skip this if using default COCO model for demo
custom_label_map = {0: 'Apple', 1: 'Asparagus', 2: 'Avocado', 3: 'Banana', 4: 'Beans', 5: 'Beef', 6: 'Beetroot', 7: 'Bell Pepper', 8: 'Bread', 9: 'Broccoli', 10: 'Cabbage', 11: 'Carrot', 12: 'Cheese', 13: 'Chicken', 14: 'Corn', 15: 'Cucumber', 16: 'Egg', 17: 'Falafel', 18: 'Grains', 19: 'Grape', 20: 'Green Beans', 21: 'Leafy Greens', 22: 'Lentils', 23: 'Meat', 24: 'Mushrooms', 25: 'Olives', 26: 'Onion', 27: 'Orange', 28: 'Pasta', 29: 'Peas', 30: 'Pomegranate', 31: 'Pork', 32: 'Potato', 33: 'Radish', 34: 'Rice', 35: 'Salmon', 36: 'Sausage', 37: 'Shrimp', 38: 'Tofu', 39: 'Tomato', 40: 'White Fish', 41: 'Zucchini'}

def detect_food_items(image_path, conf=0.4):
    results = model.predict(source=image_path, conf=conf)[0]
    detections = []

    for box in results.boxes:
        cls_id = int(box.cls[0])
        confidence = float(box.conf[0])

        class_name = model.names[cls_id]
        detections.append({
            "name": class_name.lower(),
            "confidence": round(confidence, 2)
        })

    return detections
