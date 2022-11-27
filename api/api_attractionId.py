from flask import *
import math
import json
import urllib
import mysql.connector
from mysql.connector import pooling


api_attractionId = Blueprint("api_attractionId", __name__)

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


def error(msg):
    return {
        "error": True,
        "message": msg
    }

# 根據景點編號取得景點資料


@api_attractionId.route("/api/attraction/<attractionId>")
def attraction_Id(attractionId):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    # Id result
    cursor.execute("select * from attractions where id = %s", (attractionId,))
    id_result = cursor.fetchone()
    try:
        attraction_id = int(attractionId)
        # isint = is_integer(attraction_id)
        # print(type(attraction_id))
        if id_result:
            # Turn str into list
            imgs = id_result["images"].split(" ")
            id_result["images"] = imgs
            id_list = {
                "data": id_result
            }
            status = 200
            # print(id_result)
        else:
            id_list = error("景點編號不正確")
            status = 400

    # print(id_result)
    # try:
    #     return
    except Exception:
        id_list = error("伺服器內部錯誤")
        status = 500
    finally:
        cursor.close()
        pool.close()

    response = make_response(
        id_list, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
