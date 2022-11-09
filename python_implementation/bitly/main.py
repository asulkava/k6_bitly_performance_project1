from flask import Flask, render_template, request, redirect
import os
import random
import string
import psycopg2
from psycopg2 import pool

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


def get_db_connection():
    conn = psycopg2.connect(user="username", password="password", host="database3", port="5432")
    return conn

#psql_pool = psycopg2.pool.SimpleConnectionPool(50, 500, user="username", password="password", host="database3", port="5432")
#conn = psql_pool.getconn()
#conn = psycopg2.connect(user="username", password="password", host="database3", port="5432")
#cur = conn.cursor()


app = Flask(__name__)

def get_random_string(length):
    # With combination of lower and upper case
    result_str = ''.join(random.choice(string.ascii_letters) for i in range(length))
    # print random string
    return result_str


@app.route('/', methods=['GET'])
def mainPage():
    return render_template('index.html')

@app.route('/', methods=['POST'])
def newUrl():
    #print('POST1233')
    #print(request.form.get("URL"))
    original_url = request.form.get("URL")
    randomString = get_random_string(6)
    shortened_url = 'http://localhost:7777/{}'.format(randomString) 
    #print(shortened_url)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO urls (original_url,shortened_url_code) VALUES (%s, %s)", (original_url, randomString))
    conn.commit()
    cur.close()
    conn.close()
    return render_template('newUrl.html', original_url=original_url, shortened_url=shortened_url)

@app.route('/random', methods=['GET'])
def toRandom():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM urls")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    randomUrl = random.choice(rows)
    return redirect(randomUrl[1], code=302)
   

@app.route('/<string:short_id>', methods=['GET'])
def redirectUser(short_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT original_url FROM urls WHERE shortened_url_code = %s",(short_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return redirect(row[0], code=302)




if __name__ == "__main__":
    port = int(os.environ.get('PORT', 7777))
    app.run(debug=False, host='0.0.0.0', port=port)