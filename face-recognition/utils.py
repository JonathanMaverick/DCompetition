import base64
import numpy as np
import os
from io import BytesIO
from PIL import Image
from datetime import datetime

def decode_image(image_data):
  image_data = image_data.split(",")[1]
  image_bytes = base64.b64decode(image_data)
  image = Image.open(BytesIO(image_bytes))
  return np.array(image)

def save_image(image, folder):
    # Generate a timestamp-based file name
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    file_name = f"{timestamp}.jpg"
    file_path = os.path.join(folder, file_name)
    
    # Save the image
    image.save(file_path)
    return file_path