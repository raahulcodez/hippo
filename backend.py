import json
import requests
import base64
import os
import subprocess

# Load API Key
with open("config.json") as config_file:
    config = json.load(config_file)

GROQ_API_KEY = config["GROQ_API_KEY"]

# Image File Path
image_path = "food.png"  # Change this dynamically if needed

# Extract image name without extension
image_name = os.path.splitext(os.path.basename(image_path))[0]

# Convert Image to Base64
with open(image_path, "rb") as image_file:
    base64_image = base64.b64encode(image_file.read()).decode("utf-8")

# Groq API URL
url = "https://api.groq.com/openai/v1/chat/completions"

# Request Headers
headers = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

# JSON Payload (No system message)
data = {
    "model": "llama-3.2-90b-vision-preview",
    "messages": [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze the objects in this image along with the image heading and provide a structured list of all detected items. Based on the type of objects, generate relevant suggestions: if the image contains food items, suggest one or more recipes using the identified ingredients; if it contains art supplies, propose creative craft ideas or DIY projects; if it contains physics apparatus or experimental equipment, take the image title and give a detailed context of the physics experiment with formulas, jargons and step-by-step procedure; for miscellaneous objects, provide insightful or innovative uses; if it contains Arduino or electronic components, suggest suitable hardware project ideas. Ensure the response first presents a well-formatted object list, followed by appropriate, actionable suggestions based on the detected items."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
            ]
        }
    ]
}

# Send API Request
response = requests.post(url, json=data, headers=headers)

# Parse Response
response_data = response.json()

# Save JSON response to output.json
with open("output.json", "w") as json_file:
    json.dump(response_data, json_file, indent=4)

print("✅ API response saved to output.json")
