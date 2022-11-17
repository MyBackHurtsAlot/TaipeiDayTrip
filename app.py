from flask import *
import math
import json
import urllib
import mysql.connector
from mysql.connector import pooling
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True


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


# APIs

# Error message for all
def error(msg):
    return {
        "error": True,
        "message": msg
    }

# 取得景點資料列表


@app.route("/api/attractions")
def attractions_list():
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    # Set page and keyword for searching
    page = int(request.args.get("page", 0))
    keyword = request.args.get("keyword", "")

    # page result
    p_sql = "select * from attractions limit %s, %s"
    p_val = (page * 12, 12,)
    cursor.execute(p_sql, p_val)  # from 0 * 12 to 12
    page_result = cursor.fetchall()

    # Turn str into list
    for i in page_result:
        imgs = i["images"].split(" ")
        # Put it back
        i["images"] = imgs
    # print(type(page_result))

    # Keyword result
    k_sql = "select * from attractions where category = %s or name like %s limit %s, %s"
    k_val = (keyword, "%" + keyword + "%", page * 12, 12,)
    cursor.execute(k_sql, k_val)
    keyword_result = cursor.fetchall()

    for i in keyword_result:
        imgs = i["images"].split(" ")
        # Put it back
        i["images"] = imgs
    # print(keyword_result)

    # Find last page # CAN'T BE USED IN KEY_RESULT!!!!!!!!
    cursor.execute("select id from attractions")
    last_page = cursor.fetchall()
    last_page = int(len(last_page)) / 12
    last_page = math.ceil(last_page)
    print(last_page)

    try:

        # Query search result
        # Search page only
        if keyword == "" and page < last_page - 1:
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
                "select id from attractions where category = %s or name like %s", (keyword, "%" + keyword + "%",))
            keyword_last_page = cursor.fetchall()
            keyword_last_page = int(len(keyword_last_page))/12
            keyword_last_page = math.ceil(keyword_last_page)
            print(keyword_last_page)

            if page < keyword_last_page - 1:

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


# 根據景點編號取得景點資料
@app.route("/api/attraction/<attractionId>")
def attraction_Id(attractionId):
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    # Id result
    cursor.execute("select * from attractions where id = %s", (attractionId,))
    id_result = cursor.fetchone()
    # print(type(id_result))
    try:
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
    return response


# 取得景點分類名稱列表 DONE
@app.route("/api/categories")
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


app.run(Host='0.0.0.0', port=3000, debug=True)
