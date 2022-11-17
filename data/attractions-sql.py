import json
import re
from flask import Flask, redirect, url_for, render_template, request, session, jsonify, make_response
import mysql.connector
from mysql.connector import pooling

sites = Flask(__name__)
sites.secret_key = "Df6f4er58fF456LE234Ffjke43540F"
sites.config['JSON_AS_ASCII'] = False


# Connection Pool
sites_pool = pooling.MySQLConnectionPool(
    pool_name="extension",
    pool_size=5,
    pool_reset_session=True,
    host="localhost",
    user="root",
    password="1234",
    database="taipei_attractions"
)

# open JSON
with open("taipei-attractions.json", mode="r") as file:
    all_datas = json.load(file)

datas = all_datas["result"]["results"]
for data in datas:

    # Get images
    url = data["file"].lower()
    url_separate = url.split("https")
    url_combine = " https".join(url_separate)
    separate_again = url_combine.split(" ")
    jpgs = re.compile(".*jpg")
    imgs_list = list(filter(jpgs.match, separate_again))
    imgs = " ".join(imgs_list)

    # Get id
    id = data["_id"]

    # Get names
    names = data["name"]

    # Get category
    category = data["CAT"]

    # Get description
    description = data["description"]

    # Get address
    address = data["address"]

    # Get transport
    transport = data["direction"]

    # Get mrt
    mrt = data["MRT"]

    # Get lat
    lat = data["latitude"]

    # Get lng
    lng = data["longitude"]

    # Get images
    images = imgs
    # print(images)

    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True)
    all_info = "insert into attractions(_id, name, category, description, address, transport, mrt, lat, lng, images) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(all_info, (id, names, category,
                   description, address, transport, mrt, lat, lng, images,))

    pool.commit()
    cursor.close()
    pool.close()
