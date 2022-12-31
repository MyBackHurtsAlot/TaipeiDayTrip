from flask import *
import os
from dotenv import load_dotenv
import jwt
import datetime
import json
import mysql.connector
from mysql.connector import pooling
import api.connection as pool

# load dotenv
load_dotenv()


api_user = Blueprint("api_user", __name__)
secret = os.getenv("secret")

# pool
sites_pool = pool.pool()


# ======== Error message ========
def error(msg):
    return {
        "error": True,
        "message": msg
    }


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


# ======== Register ========
@api_user.route("/api/user", methods=["POST"])
def user_register():
    register = request.get_json()
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)

    try:
        # print(register)
        if register["memberName"] == "" or register["memberEmail"] == "" or register["memberPassword"] == "":
            status = 400
            user_registered = error("請註冊")
            # print(type(register["memberName"]))
        else:
            cursor.execute(
                "select email from membership where email = %s",
                (register["memberEmail"],))
            exists = cursor.fetchone()

            if exists:
                status = 400
                user_registered = error("Email已被註冊")
            else:
                status = 200
                member_register = "insert into membership(name, email, password) values(%s,%s, %s)"

                cursor.execute(
                    member_register,
                    (register["memberName"], register["memberEmail"], register["memberPassword"]))
                pool.commit()
                user_registered = {"ok": True}
    except Exception:
        user_registered = error("伺服器內部錯誤")
        status = 500
    finally:
        cursor.close()
        pool.close()

    response = make_response(
        user_registered, status, {"Content-Type": "application/json"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# ======== Get member info ========
@api_user.route("/api/user/auth")
def get_Member_Info():

    check_token = request.cookies.get("token")
    # print(check_token)
    if check_token is None:
        return {"data": None}
    else:
        check_token = jwt.decode(check_token, secret, algorithms=['HS256'])
        # print(check_token["id"])
        user_id = check_token["id"]
        info = get_user_info(user_id)
        response = make_response({
            "data": {
                "id": check_token["id"],
                "name": info["name"],
                "email": info["email"]
            }
        })
        status = 200
        return response, status


# ======== Sign in =============
@api_user.route("/api/user/auth", methods=["PUT"])
def member_SignIn():
    sign_in = request.get_json()
    pool = sites_pool.get_connection()
    cursor = pool.cursor(buffered=True, dictionary=True)
    # print(sign_in["signInEmail"])
    cursor.execute(
        "select email from membership where email = %s and password = %s", (
            sign_in["signInEmail"], sign_in["signInPassword"],)
    )
    isMember = cursor.fetchone()
    # print(isMember)

    try:
        if isMember:
            cursor.execute(
                "select id, name, email from membership where email = %s", (
                    sign_in["signInEmail"],)
            )
            member_info = cursor.fetchone()
            # print(member_info["id"])

            user = {
                "id": member_info["id"],
                "name": member_info["name"],
                "email": member_info["email"]
            }
            # print(user)

            exp = datetime.datetime.now() + datetime.timedelta(days=7)
            encoded = jwt.encode(
                user,
                secret,
                algorithm='HS256')
            signed_In = {"ok": True}
            status = 200
            # print(secret)
            # print(encoded)
            response = make_response(
                signed_In, status, {"Content-Type": "application/json"})
            # Sets client side cookie
            response.set_cookie("token", encoded, expires=exp)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            signed_In = error("帳號或密碼錯誤")
            status = 400
            return signed_In, status

    except Exception:
        signed_In = error("伺服器內部錯誤")
        status = 500
        return signed_In, status
    finally:
        cursor.close()
        pool.close()


# ======== Sign out ============
@api_user.route("/api/user/auth", methods=["DELETE"])
def member_Signout():
    response = make_response({"ok": True})
    status = 200
    response.set_cookie("token", expires=0)
    return response
