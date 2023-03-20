import csv
import json

csv_file_path_cities = "output/cities_final2.csv"
json_file_path_cities = "output/cities_final2.json"

csv_file_path_countries = "output/countries_final.csv"
json_file_path_countries = "output/countries_final.json"

# Read CSV file and convert it to a list of dictionaries
with open(csv_file_path_cities, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    data_cities = [row for row in csv_reader]

# Write the data to a new JSON file
with open(json_file_path_cities, 'w') as json_file:
    json.dump(data_cities, json_file, indent=4)
    
# Read CSV file and convert it to a list of dictionaries
with open(csv_file_path_countries, 'r') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    data_countries = [row for row in csv_reader]

# Write the data to a new JSON file
with open(json_file_path_countries, 'w') as json_file:
    json.dump(data_countries, json_file, indent=4)