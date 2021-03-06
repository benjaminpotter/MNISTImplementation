from flask import Flask, request
from json import loads
import numpy as np
import tensorflow as tf

app = Flask(__name__)

@app.route("/predict", methods=["GET", "POST"])
def predict():
  data = loads(request.data)

  settings = data["settings"] # settings is an int between 0-3
  display = data["display"] # display is the 2d array from before

  # do the prediction logic here
  # the function should return the prediction made by the algorithm
  
  prediction = np.argmax(model.predict([display]))

  return str(prediction)

if __name__ == "__main__":
  model = tf.keras.models.load_model('./digitClassifier.model')
  app.run(port=5000)