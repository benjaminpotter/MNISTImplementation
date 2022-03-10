from flask import Flask, request
from json import loads, dumps

from random import randint # TEMPORARY

app = Flask(__name__)

@app.route("/predict", methods=["GET", "POST"])
def predict():
  display = loads(request.data) # display -> a 2d array of all pixel values

  # do the prediction logic here
  # the function should return the prediction made by the algorithm
  

  return str(randint(0, 9))

if __name__ == "__main__":
  app.run(port=5000)