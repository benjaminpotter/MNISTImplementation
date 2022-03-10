from flask import Flask, request
from json import loads, dumps
import numpy as np
#import tensorflow as tf

from random import randint # TEMPORARY
#model = tf.keras.models.load_model('./digitClassifier.model')


app = Flask(__name__)

@app.route("/predict", methods=["GET", "POST"])
def predict():
  

  display = loads(request.data) # display -> a 2d array of all pixel values

  # do the prediction logic here
  # the function should return the prediction made by the algorithm
  
  prediction = 0 #np.argmax(model.predict([display]))

  return str(prediction)

if __name__ == "__main__":
  app.run(port=5000)