from flask import *
import math
import json
import urllib
import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv
import jwt

# load dotenv
# load_dotenv()

# Import apis
from api.api_attractions import api_attractions
from api.api_user import api_user


app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Regist apis
app.register_blueprint(api_attractions)
app.register_blueprint(api_user)


# Pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


app.run(host='0.0.0.0', port=3000, debug=True)
