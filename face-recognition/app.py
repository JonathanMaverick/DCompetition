from flask import Flask, request, jsonify
from flask_cors import CORS
from deepface import DeepFace
import os
from utils import decode_image, save_image, save_temp_image

app = Flask(__name__)
CORS(app)

STORAGE_PATH = 'storage'

@app.route('/check-face', methods=['POST'])
def check_face():
  try:
    data = request.get_json()
    image_base64 = data.get('image')
    image_array = decode_image(image_base64)
    temp_image_path = save_temp_image(image_array)

    analyze = DeepFace.analyze(
      img_path=temp_image_path,
      actions=('emotion'),
    )

    print(analyze[0]['dominant_emotion'])
    print(analyze[0]['dominant_emotion'].strip().lower() != 'neutral')

    if analyze[0]['dominant_emotion'].strip().lower() != 'neutral':
      return jsonify({"message": "Please take neutral face expression"})

    for file_name in os.listdir(STORAGE_PATH):
      file_path = STORAGE_PATH + '/' + file_name
            
      result = DeepFace.verify(
        img1_path=temp_image_path, 
        img2_path=file_path
      )
      print(f"Comparing with {file_name}: {result['distance']}, {result['verified']} ")
            
      if result['distance'] < 0.4 and result['verified']:
        return jsonify({"message": "Face already used."}), 200
        
    save_image(image_array, STORAGE_PATH)
    return jsonify({"message": "No match found."}), 200
    
  except Exception as e:
    print(f"Error: {e}")
    return jsonify({"message": {e}}), 500
  
  finally:
    if os.path.exists(temp_image_path):
      os.remove(temp_image_path)

if __name__ == '__main__':
  app.run(port=1234)
