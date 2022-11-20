from flask import *
import math
import json
import urllib
import mysql.connector
from mysql.connector import pooling


api_categories = Blueprint("api_categories", __name__)

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


@api_categories.route("/api/categories")
def cat():
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    cursor.execute("select distinct category from attractions")
    result = cursor.fetchall()

    # append vlaue of categories into list
    cat_data = []
    for i in result:
        cat_data.append(i["category"])
        all_cats = {"data": cat_data}

    # 200
    try:
        status = 200
        cat_result = all_cats
        # raise Exception

    # 500
    except Exception:
        all_cats = error("伺服器內部錯誤")
        status = 500
    finally:
        cursor.close()
        pool.close()

    response = make_response(
        all_cats, status, {"Content-Type": "application/json"})
    return response
