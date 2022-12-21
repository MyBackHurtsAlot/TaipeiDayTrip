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

# load dotenv
load_dotenv()


api_order = Blueprint("api_order", __name__)
secret = os.getenv("secret")
partner_key = os.getenv("partner_key")
merchant_id = os.getenv("merchant_id")
# pool
sites_pool = pool.pool()


# ================== SQL ====================
def sign_orders(order, check_token):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        to_table = "INSERT INTO orders(\
            user_id,\
            attraction_id,\
            order_status,\
            order_date,\
            order_time,\
            user_name,\
            user_email,\
            user_phone\
        )VALUE(%s,%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(
            to_table, (
                check_token["id"],
                order["order"]["trip"]["attraction"]["id"],
                "未付款",
                order["order"]["trip"]["date"],
                order["order"]["trip"]["time"],
                order["order"]["contact"]["name"],
                order["order"]["contact"]["email"],
                order["order"]["contact"]["phone"]
            )
        )
        pool.commit()
    finally:
        cursor.close()
        pool.close()


# ==== Renew Order =====
def renew_orders(check_token):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute("UPDATE orders\
            SET order_status = '已付款' WHERE\
            user_id =%s", (check_token["id"],))
        pool.commit()
    finally:
        cursor.close()
        pool.close()


# ==== History Order =====
def history_orders(order, order_Number):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        to_history_orders = "INSERT INTO history_orders(\
            order_number,\
                price,\
                attraction_id,\
                attraction_name,\
                attraction_address,\
                attraction_image,\
                order_date,\
                order_time,\
                user_name,\
                user_email,\
                user_phone\
                    )VALUE(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"

        cursor.execute(
            to_history_orders, (
                order_Number,
                order["order"]["price"],
                order["order"]["trip"]["attraction"]["id"],
                order["order"]["trip"]["attraction"]["name"],
                order["order"]["trip"]["attraction"]["address"],
                order["order"]["trip"]["attraction"]["image"],
                order["order"]["trip"]["date"],
                order["order"]["trip"]["time"],
                order["order"]["contact"]["name"],
                order["order"]["contact"]["email"],
                order["order"]["contact"]["phone"]
            )
        )
        pool.commit()
    except Exception as e:
        print(e)
    finally:

        cursor.close()
        pool.close()


# ==== Get History Order =====
def get_history(check_token):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    try:
        cursor.execute("SELECT * FROM history_orders\
             WHERE user_email = %s", (check_token["email"],))
        history = cursor.fetchall()
        return history
    finally:
        cursor.close()
        pool.close()


# Delete reservation
def empty_cart(member_ID):
    # print(member_ID)
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    cursor.execute("DELETE FROM purchased_Item\
        WHERE\
            member_id = %s", (member_ID["id"],))  # delete all orders from this member
    pool.commit()
    cursor.close()
    pool.close()

# ======== Tappay ========


def to_tappay(order):
    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    headers = {"Content-Type": "application/json", "x-api-key": partner_key}
    to_tappay_infos = {
        "prime": order["prime"],
        "partner_key": partner_key,
        "merchant_id": merchant_id,
        "details": "TapPay Test",
        "amount": order["order"]["price"],
        "cardholder": {
            "phone_number": order["order"]["contact"]["phone"],
            "name": order["order"]["contact"]["name"],
            "email": order["order"]["contact"]["email"]
        }
    }

    response = requests.post(url, headers=headers, json=to_tappay_infos).json()
    status_code = response["status"]
    return status_code

# ======== Error message ========


def error(msg):
    return {
        "error": True,
        "message": msg
    }


# ====== New Orders ========
@api_order.route("/api/order", methods=["POST"])
def new_Orders():
    order = request.get_json()
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    member_ID = check_token["id"]
    time = datetime.now()
    ordered_Time = time.strftime("%Y%m%d%H%M%S")

    try:
        to_pay = error("伺服器內部錯誤")
        status = 0
        if check_token is None:
            to_pay = error("你沒登入")
            status = 403
        if all(order.values()):
            order_Number = str(order["order"]["trip"]["attraction"]["id"]) + \
                ordered_Time + \
                "盤"\
                + str(order["order"]["contact"]["phone"])
            sign_orders(order, check_token)
            status_code = to_tappay(order)

            if status_code == 0:
                to_pay = {
                    "data": {
                        "number": order_Number,
                        "payment": {
                            "status": status_code,
                            "message": "付款成功"
                        }
                    }
                }
                renew_orders(check_token)
                history_orders(order, order_Number)
                empty_cart(check_token)
                status = 200
            else:
                to_pay = error("沒有錢嗎")
                stutus = 400
        else:
            to_pay = error("資料不得為空")
            status = 400
    except Exception:
        to_pay = error("伺服器內部錯誤")
        status = 500
    finally:
        response = make_response(
            to_pay, status, {"Content-Type": "application/json"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


@api_order.route("/api/order")
def get_orderNumber():
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    orderNumber = request.args.get("orderNumber")
    paid = get_history(check_token)
    # print(paid)
    history = {
        "data": {
            "number": orderNumber,
            "price": paid[-1]["price"],
            "trip": {
                "attraction": {
                    "id": paid[-1]["attraction_id"],
                    "name": paid[-1]["attraction_name"],
                    "address": paid[-1]["attraction_address"],
                    "image": paid[-1]["attraction_image"]
                },
                "date": paid[-1]["order_date"],
                "time": paid[-1]["order_time"]
            },
            "contact": {
                "name": paid[-1]["user_name"],
                "email": paid[-1]["user_email"],
                "phone": paid[-1]["user_phone"]
            },
            "status": 1
        }
    }
    status = 200
    response = make_response(
        history, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
