import mysql.connector
from flask import *
import os
from dotenv import load_dotenv
import json
from mysql.connector import pooling

# load dotenv
load_dotenv()


password = os.getenv("password")


def pool():
    return pooling.MySQLConnectionPool(
        pool_name="extension",
        pool_size=5,
        pool_reset_session=True,
        host="localhost",
        user="root",
        password=password,
        database="taipei_attractions"
    )
