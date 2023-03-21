import sqlite3
import pandas as pd
import os 


conn = sqlite3.connect('HDI_db.sqlite')
c = conn.cursor()

countries_df = pd.read_csv(os.path.join("output", "countries_final.csv"),header=0)
cities_df = pd.read_csv(os.path.join("output", "cities_final3.csv"),header=0)


country_columns_map = {
    "HDI Rank (2021)":"HDI_rank_2021",
    "Human Development Index (HDI)":"HDI_index",
    "Life expectancy at birth":"life_exp_birth",
    "Expected years of schooling":"expected_years_schooling",
    "Mean years of schooling":"mean_years_schooling",
    "Gross national income (GNI) per capita (2017 PPP $)":"GNI_capita_ppp_2017",
    "GNI per capita rank minus HDI rank":"GNI_minus_HDI_rank",
    "HDI rank (2020)":"HDI_rank_2020",
    "HDI Category":"HDI_category"
}

countries_df = countries_df.rename(columns=country_columns_map)

c.execute('DROP table IF EXISTS countries')
c.execute('DROP table IF EXISTS cities')

c.execute('''CREATE TABLE IF NOT EXISTS countries 
         (id INTEGER PRIMARY KEY,
         "HDI_rank_2021" INT, 
         "Countries" TEXT,
         "HDI_index" REAL, 
         "life_exp_birth" REAL,
         "expected_years_schooling" REAL,
         "mean_years_schooling" REAL,
         "GNI_capita_ppp_2017" REAL,
         "GNI_minus_HDI_rank" REAL,
         "HDI_rank_2020" INT,
         "HDI_category" INT,
         "Education Index" REAL,
         "alpha-3" TEXT,
         "region" TEXT,
         "sub-region" TEXT,
         "Lat" REAL,
         "Lon" REAL,
         "crime_index" REAL,
         "LPP_index" REAL,
         "healthcare_index" REAL
         )
         '''
)

c.execute('''CREATE TABLE IF NOT EXISTS cities
         (id INTEGER PRIMARY KEY,
         "city_country" TEXT,
         "LPP_index" REAL,
         "crime_index" REAL,
         "healthcare_index" REAL,
         "lat" REAL,
         "lon" REAL,
         "alpha-3" TEXT
         "Countries" TEXT
         "region" TEXT
         'sub-region" TEXT
         )
          '''
)

countries_df.to_sql('countries', con=conn, if_exists='append', index=False)
cities_df.to_sql('cities', con=conn, if_exists='append', index=False)

c.execute("SELECT COUNT(*) FROM countries")
print("Countries table row count:", c.fetchone()[0])

c.execute("SELECT COUNT(*) FROM cities")
print("Cities table row count:", c.fetchone()[0])

conn.commit()

conn.close()