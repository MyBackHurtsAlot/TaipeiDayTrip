from flask import *
import os
from dotenv import load_dotenv
import jwt
import datetime
import json
import mysql.connector
from mysql.connector import pooling
import api.connection as pool


api_booking = Blueprint("api_booking", __name__)

sites_pool = pool.pool()
secret = os.getenv("secret")

# ============== sql ===============

# Reservation


def New_Reservation(new_Itinerary, check_token):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    reservation = "INSERT INTO purchased_Item(\
                attractionId, \
                date, \
                time, \
                price,\
                member_id\
                    )\
                    VALUE(%s, %s, %s, %s, %s)"
    cursor.execute(
        reservation, (new_Itinerary["attraction"],
                      new_Itinerary["date"],
                      new_Itinerary["time"],
                      new_Itinerary["price"],
                      check_token["id"]))
    pool.commit()
    cursor.close()
    pool.close()


# get Info
def New_Order(user_Id):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    cursor.execute("SELECT attractions.ID, \
        name, \
        address, \
        images, \
        date, \
        time, \
        price \
        FROM attractions\
            INNER JOIN purchased_Item\
                on attractions.ID = purchased_Item.attractionId\
                    WHERE purchased_Item.member_id = %s",
                   (user_Id,))
    order = cursor.fetchall()
    cursor.close()
    pool.close()
    return order


# Delete reservation
def delete_Order(member_ID):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    cursor.execute("DELETE FROM purchased_Item\
        WHERE\
            member_id = %s", (member_ID,))  # delete all orders from this member
    pool.commit()
    cursor.close()
    pool.close()


# ============== Error message ===============


def error(msg):
    return {
        "error": True,
        "message": msg
    }


# ============== Check itinerary ==============
@ api_booking.route("/api/booking")
def itinerary_Check():
    check_token = request.cookies.get("token")
    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
    user_Id = check_token["id"]
    order = New_Order(user_Id)
    # print(order)
    try:
        if check_token is None:
            order_info = error("請先登入")
            status = 403
        elif order == []:
            order_info = error("買個行程啦")
            status = 400
        else:
            order_info = {
                "data": {
                    "attraction": {
                        "id": order[-1]["ID"],
                        "name": order[-1]["name"],
                        "address": order[-1]["address"],
                        "image": order[-1]["images"]
                    },
                    "date": order[-1]["date"],
                    "time": order[-1]["time"],
                    "price": order[-1]["price"]
                }
            }

            # print(order["date"])
            status = 200
    except Exception:
        order_info = error("伺服器內部錯誤")
        status = 500
    finally:
        response = make_response(
            order_info, status, {
                "Content-Type": "application/json"}
        )
    return response


# ============== New itinerary ==============
@ api_booking.route("/api/booking", methods=["POST"])
def New_Itinerary():
    new_Itinerary = request.get_json()
    check_token = request.cookies.get("token")
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    check_token = jwt.decode(check_token, secret, algorithms=['HS256'])

    # print(new_Itinerary)
    try:
        if new_Itinerary["attraction"] == "" or new_Itinerary["date"] == "" or new_Itinerary["time"] == "" or new_Itinerary["price"] == "":
            newReservation = error("請輸入資訊")
            status = 400
        else:
            newReservation = {
                "ok": True
            }
            New_Reservation(new_Itinerary, check_token)
            status = 200
    except Exception:
        newReservation = error("伺服器內部錯誤")
        status = 500
    finally:
        response = make_response(
            newReservation, status, {"Content-Type": "application/json"})
        response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# ============== Delete itinerary ==============
@ api_booking.route("/api/booking", methods=["DELETE"])
def delete_Itinerary():
    delete_Itinerary = request.get_json()
    attraction_Id = delete_Itinerary["atractionId"]
    member_ID = delete_Itinerary["memberId"]
    print(member_ID)

    # order one itinerary at a time
    delete_Order(member_ID)
    response = make_response({"ok": True})
    status = 200

    return response
