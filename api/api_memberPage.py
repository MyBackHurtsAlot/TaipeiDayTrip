from flask import *
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime
import json
import mysql.connector
from mysql.connector import pooling
import api.connection as pool
import requests
import re

# load dotenv
load_dotenv()
api_memberPage = Blueprint("api_memberPage", __name__)
secret = os.getenv("secret")

sites_pool = pool.pool()

# ======== Error message ========


def error(msg):
    return {
        "error": True,
        "message": msg
    }

# ======================= SQL ===============================

# ======================= Change Name ===============================


def change_user_name(new_name, user_id):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(
            "update membership set name = %s where id = %s",
            (new_name, user_id,)
        )
        pool.commit()
    finally:
        cursor.close()
        pool.close()

# ======================= Change Password ===============================


def change_user_password(new_password, user_id):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(
            "update membership set password = %s where id = %s",
            (new_password, user_id,)
        )
        pool.commit()
    finally:
        cursor.close()
        pool.close()


# ======================= Changge Image ===============================
def change_user_img(avator_path, user_id):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        print(avator_path)
        cursor.execute(
            "update membership set avator = %s where id = %s",
            (avator_path, user_id,)
        )
        pool.commit()
    finally:
        cursor.close()
        pool.close()

# ======================= Get User Info ===============================


def get_user_info(user_id):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute(
            "SELECT * FROM membership WHERE id = %s",
            (user_id,)
        )
        member_info = cursor.fetchone()
        return member_info
    finally:
        cursor.close()
        pool.close()


# ======================= Route ===============================

# ======================== Get data ==============================
@api_memberPage.route("/api/memberPage")
def get_member_info():
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    user_id = check_token["id"]
    try:
        info = get_user_info(user_id)
        member_data = {
            "id": info["id"],
            "name": info["name"],
            "email": info["email"],
            "password": info["password"],
            "avator": info["avator"]
        }
        status = 200
    finally:
        response = make_response(
            member_data, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

# ======================== Name ==============================


@api_memberPage.route("/api/memberPage/name", methods=["PATCH"])
def new_user_name():
    new_user_name = request.get_json()
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    user_id = check_token["id"]
    new_name = new_user_name["name"]
    change_user_name(new_name, user_id)
    try:
        info = get_user_info(user_id)
        member_data = {
            "id": info["id"],
            "name": info["name"],
            "email": info["name"]
        }
        status = 200
    finally:
        response = make_response(
            member_data, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# ======================== Password ==============================
@api_memberPage.route("/api/memberPage/password", methods=["PATCH"])
def new_user_password():
    new_user_password = request.get_json()
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    user_id = check_token["id"]
    new_password = new_user_password["password"]
    change_user_password(new_password, user_id)
    try:
        info = get_user_info(user_id)
        member_data = {
            "id": info["id"],
            "name": info["name"],
            "email": info["name"]
        }
        status = 200
    finally:
        response = make_response(
            member_data, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# ======================== Password ==============================
@api_memberPage.route("/api/memberPage/avator", methods=["PATCH"])
def new_user_avator():
    new_user_img = request.files["file"]
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    user_id = check_token["id"]

    try:
        if new_user_img == None:
            new_avator = error("請更換照片")
        else:
            last_dot = new_user_img.filename.rfind(".")
            no_dot = re.sub(r"\.", "",
                            new_user_img.filename[:last_dot]) + new_user_img.filename[last_dot:]
            print(no_dot)
            no_dot_and_space = no_dot.replace(" ", "")
            print(no_dot_and_space)
            avator_path = os.path.join(
                "./static/imgs/MemberPage", no_dot_and_space)
            new_user_img.save(avator_path)
            change_user_img(avator_path, user_id)
            avator = get_user_info(user_id)
            print(avator["avator"])
            new_avator = {
                "avator_path": avator["avator"]
            }
            status = 200
    except Exception as e:
        status = 500
        print(e)
        new_avator = error("伺服器內部錯誤")
    finally:
        response = make_response(
            new_avator, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
