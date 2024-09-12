from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
from utils import decode_image, save_image

app = Flask(__name__)
CORS(app)

STORAGE_PATH = 'storage'

@app.route('/check-face', methods=['POST'])
def check_face():
  data = request.get_json()
  image_base64 = data.get('image')
  image = decode_image(image_base64)

  try:
    for file_name in os.listdir(STORAGE_PATH):
      file_path = os.path.join(STORAGE_PATH, file_name)
            
      result = DeepFace.verify(
        img1_path=image, 
        img2_path=file_path, 
        model_name='VGG-Face',
        detector_backend='retinaface',
        anti_spoofing=True
      )
      print(f"Comparing with {file_name}: {result}")
            
      if result['verified'] == True:
        save_image(image, STORAGE_PATH)
        return jsonify({"message": f"Match found with {file_name}!"}), 200
        
    return jsonify({"message": "No match found."}), 200
    
  except Exception as e:
    print(f"Error: {e}")
    return jsonify({"message": "Error processing image."}), 500

if __name__ == '__main__':
  app.run(port=5000)
