from flask import Flask, request
from json import loads
import numpy as np
import tensorflow as tf
import matplotlib
import numpy
import pickle
import sklearn

SVM = None
CNN = None
KNN = None

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
  
  if settings == 0:
    prediction = np.argmax(CNN.predict([arr]))
  if settings == 1:
    prediction = np.argmax(KNN.predict([arr]))
  if settings == 2:
    prediction = np.argmax(SVM.predict([arr]))
  if settings == 3:
    prediction1 = np.argmax(CNN.predict([arr]))
    prediction2 = np.argmax(KNN.predict([arr]))
    prediction3 = np.argmax(SVM.predict([arr]))
    lst = [prediction1, prediction2, prediction3]
    print(lst)

    prediction = max(lst, key=lst.count)


  return str(prediction)

if __name__ == "__main__":
  SVM = tf.keras.models.load_model('./digitClassifier.model')
  CNN = tf.keras.models.load_model('CNN')
  KNN = pickle.load(open('KNN.model', 'rb'))
  app.run(port=5000)