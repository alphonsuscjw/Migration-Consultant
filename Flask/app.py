import sqlite3
from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map')
def map_page():
    return render_template('map.html')

@app.route('/api/hdi')
def get_hdi():
    conn = sqlite3.connect('HDI_db.sqlite')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM countries')
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        item = {
            "HDI Rank (2021)": row[0],
            "Countries": row[1],
            "Human Development Index (HDI)": row[2],
            "Life expectancy at birth": row[3],
            "Expected years of schooling": row[4],
            "Mean years of schooling": row[5],
            "Gross national income (GNI) per capita (2017 PPP $)": row[6],
            "GNI per capita rank minus HDI rank": row[7],
            "HDI rank (2020)": row[8],
            "HDI Category": row[9],
            "Education Index": row[10],
            "alpha-3": row[11],
            "region": row[12],
            "sub-region": row[13],
            "Lat": row[14],
            "Lon": row[15],
            "crime_index": row[16],
            "LPP_index": row[17],
            "healthcare_index": row[18]
        }
        data.append(item)

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
