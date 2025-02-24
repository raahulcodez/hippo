import cv2
import pandas as pd
import os
import subprocess

# Threshold for object detection
thres = 0.45  
conf_thresh = 65  # Minimum confidence threshold to save to CSV

# Video source (IP camera)
cap = cv2.VideoCapture("http://10.31.24.160:8080/video")
cap.set(3, 1280)
cap.set(4, 720)
cap.set(10, 70)

# Load COCO class names
classFile = 'coco.names'
with open(classFile, 'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')

# Load the pre-trained model
configPath = 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt'
weightsPath = 'frozen_inference_graph.pb'

net = cv2.dnn_DetectionModel(weightsPath, configPath)
net.setInputSize(320, 320)
net.setInputScale(1.0 / 127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)

# CSV File setup
csv_file = "detected_objects.csv"

# Reset the CSV file on every run
if os.path.exists(csv_file):
    os.remove(csv_file)

# Create an empty dataframe
df = pd.DataFrame(columns=["Class", "Confidence", "BBox"])

# Set to store already detected items (avoids redundancy)
detected_objects = set()

while True:
    success, img = cap.read()
    if not success:
        break

    # Object detection
    classIds, confs, bbox = net.detect(img, confThreshold=thres)
    
    if len(classIds) != 0:
        for classId, confidence, box in zip(classIds.flatten(), confs.flatten(), bbox):
            class_name = classNames[classId - 1].upper()
            confidence_percentage = round(confidence * 100, 2)  # Convert confidence to percentage

            # Filter out "PERSON"
            if class_name == "PERSON":
                continue  

            # Check confidence threshold
            if confidence_percentage < conf_thresh:
                continue  # Skip low-confidence detections

            # Generate a unique identifier (class + bounding box)
            object_key = f"{class_name}_{box[0]}_{box[1]}_{box[2]}_{box[3]}"

            # If the object has not been logged, add it
            if object_key not in detected_objects:
                detected_objects.add(object_key)  # Mark as detected
                
                # Draw bounding box and text
                cv2.rectangle(img, box, color=(0, 255, 0), thickness=2)
                cv2.putText(img, class_name, (box[0] + 10, box[1] + 30),
                            cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
                cv2.putText(img, str(confidence_percentage), (box[0] + 200, box[1] + 30),
                            cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)

                # Save to DataFrame
                new_entry = {"Class": class_name, "Confidence": confidence_percentage, "BBox": str(box.tolist())}
                df = pd.concat([df, pd.DataFrame([new_entry])], ignore_index=True)
                df.to_csv(csv_file, index=False)

    cv2.imshow("Output", img)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to stop
        break


cap.release()
cv2.destroyAllWindows()
