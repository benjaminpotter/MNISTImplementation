from flask import Flask, request
from json import loads
import numpy as np
import tensorflow as tf
import matplotlib
import numpy

model = None
arr = None

app = Flask(__name__)

@app.route("/predict", methods=["GET", "POST"])
def predict():
  data = loads(request.data)
  arr = np.zeros((28, 28), dtype=int)
  # print(data)
  
  settings = data["settings"] # settings is an int between 0-3
  display = data["display"] # display is the 2d array from before
  arr = np.flip(np.rot90(np.array(display), -1), 1)
  arr = arr.tolist() 
  prediction = np.argmax(model.predict([arr]))

  return str(prediction)

if __name__ == "__main__":
  model = tf.keras.models.load_model('./digitClassifier.model')
  app.run(port=5000)