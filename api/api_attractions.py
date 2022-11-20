from flask import *
import math
import json
import urllib
import mysql.connector
from mysql.connector import pooling


api_attractions = Blueprint("api_attractions", __name__)

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

# 取得景點資料列表


@api_attractions.route("/api/attractions")
def attractions_list():
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    try:
        # Set page and keyword for searching
        page = int(request.args.get("page", 0))
        keyword = request.args.get("keyword", "")

    # page result
        if keyword == "":
            p_sql = "select * from attractions limit %s, %s"
            p_val = (page * 12, 12,)
            cursor.execute(p_sql, p_val)  # from 0 * 12 to 12
            page_result = cursor.fetchall()
            p_len = (len(page_result))

        # Turn str into list
            for i in page_result:
                imgs = i["images"].split(" ")
                # Put it back
                i["images"] = imgs
        # print(type(page_result))
        else:
            # Keyword result
            k_sql = "select * from attractions where category = %s or name like %s limit %s, %s"
            k_val = (keyword, "%" + keyword + "%", page * 12, 12,)
            cursor.execute(k_sql, k_val)
            keyword_result = cursor.fetchall()
            k_len = (len(keyword_result))
            print(k_len)

            for i in keyword_result:
                imgs = i["images"].split(" ")
                # Put it back
                i["images"] = imgs
            # print(keyword_result)

    # Set last page
        last_page = 12

        # Query search result
        # Search page only
        if keyword == "" and p_len == last_page:
            att_list = {
                "nextPage": page + 1,
                "data": page_result
            }
            status = 200
        elif keyword == "":
            att_list = {
                "nextPage": None,
                "data": page_result
            }
            status = 200
        else:
            cursor.execute(
                "select count(*) from attractions where category = %s or name like %s", (keyword, "%" + keyword + "%",))
            keyword_last_page = cursor.fetchall()

            if k_len == last_page:

                att_list = {
                    "nextPage": page + 1,
                    "data": keyword_result
                }
                status = 200
            else:
                att_list = {
                    "nextPage": None,
                    "data": keyword_result
                }
                status = 200

    except Exception:
        att_list = error("伺服器內部錯誤")
        status = 500

    finally:
        cursor.close()
        pool.close()

    response = make_response(
        att_list, status, {"Content-Type": "application/json"})
    return response
