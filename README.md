# Migration Consultant

This project designs a webpage which helps people decide which country is the best to migrate to. The webpage has a dashboard and a map that display data for countries and cities that are relevant to making migration decisions.

There are 5 stages to this project:
1. We located the data sources and cleaned the dataset with Python and Pandas.
2. We wrote the dataset into a SQLite database.
3. We set up the Flask API to run the webpage.
4. We downloaded and modified a bootscrap template and then designed the dasboard on that basis. The dashboard has a scatter plot and a radar plot that show various indices for countries in each continent, as well as definitions to the various indices.
5. We also designed an interactive map using Leaflet that allows the user to further explore the data for each country and city.

Data sources:
1. United Nations Database (HDI)
2. Numbeo

File Structure:
- dataset -> Contains all the CSV files used to curate our dataset
- output -> output files from the data cleaning/processing stage (from cleaning.ipynb)
- static -> contains bootstrap plugins + geojson data (data)
- templates -> html files for website structure
- app.py = python code that contains Flask routes
- cleaning.ipynb = jupyter notebook containing data cleaning process
- schema.py = python code to create the SQLite database.

Instructions to run the programme:
1. Activate your virtual environment
2. Pip install flask_cors module
3. In Git Bash, cd to the directory in which app.py file is located on your local computer
4. Enter "flask run" or python app.py" to run the flask
