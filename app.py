# import necessary libraries
from flask import Flask
from flask_restful import Api
from pymongo import MongoClient

# Flask Setup
app = Flask(__name__)

# Database Setup

client = MongoClient("mongodb+srv://user:NvmXT1ues8eAKUkI@frozensectiondb.nljti.gcp.mongodb.net/FrozenSection?retryWrites=true&w=majority")
db = client.FrozenSection

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Pull collection test
# collection = db.all_georgia
# print(collection)
