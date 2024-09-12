import base64
import numpy as np
import os
from io import BytesIO
from PIL import Image
from datetime import datetime
import time

TEMP_PATH = 'temp'

def decode_image(image_data):
  image_data = image_data.split(",")[1]
  image_bytes = base64.b64decode(image_data)
  image = Image.open(BytesIO(image_bytes))
  return np.array(image)

def save_temp_image(image_array):
  file_name = f"{TEMP_PATH}/temp_image_{int(time.time())}.jpg"
    
  temp_image = Image.fromarray(image_array)
  temp_image.save(file_name)

  return file_name

def save_image(image_array, folder):
    # Generate a timestamp-based file name
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    file_name = f"{timestamp}.jpg"
    file_path = os.path.join(folder, file_name)
    
    # Save the image
    image = Image.fromarray(image_array)
    image.save(file_path)