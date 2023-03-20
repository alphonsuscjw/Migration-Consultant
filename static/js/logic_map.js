// Create the map object with options.
let myMap = L.map("map", {
    center: [4.3995, 113.9914],
    zoom: 3
});
    
// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Perform an API call to the USGS API to get the earthquake information. Call createMarkers when it completes.
let city_url = "../../Data/output/cities_final2.json"
d3.json(city_url).then(function(city_data) {
    createCityMarkers(city_data);
});

// Create the createMarkers function.
function createCityMarkers(city_response) {
    
    cities = city_response;
    // Initialise an array to hold the earthquake markers.

    let cityMarkers = L.markerClusterGroup();
    // Loop through the features array.
    for (let i=0; i< cities.length; i++) {  
      
        // Create an empty string to store the HTML for the popup
        let popupHtml = `<h2>${cities[i].city_country}</h2>`;

        // Add the LPP index to the popup if it is not empty
        if (cities[i].LPP_index) {
            popupHtml += `<h3>LPP index: ${cities[i].LPP_index}</h3>`;
        }
        else {
            popupHtml += `<h3>LPP index: N/A</h3>`;
        }

        if (cities[i].crime_index) {
            popupHtml += `<h3>Crime index: ${cities[i].crime_index}</h3>`;
        }
        else {
            popupHtml += `<h3>Crime index: N/A</h3>`;
        }

        if (cities[i].healthcare_index) {
            popupHtml += `<h3>Healthcare index: ${cities[i].healthcare_index}</h3>`;
        }
        else {
            popupHtml += `<h3>Healthcare index: N/A</h3>`;
        }

        // For each feature, create a circle marker, and bind a popup with the earthquake's magnitude, depth, place and time.
        cityMarkers.addLayer(L.marker([cities[i].lat, cities[i].lon])
        .bindPopup(popupHtml));
        
    }

    myMap.addLayer(cityMarkers);

}

// Load the countries data and add it to the map as a GeoJSON layer.
let countries_url_1 = "../../Data/output/countries_final.json";
let countries_url_2 = "../../Data/output/countries.geojson";
// Load JSON file
fetch(countries_url_1)
.then(response => response.json())
.then(jsonData => {
    // Load GeoJSON file
    fetch(countries_url_2)
    .then(response => response.json())
    .then(geojsonData => {
        // Merge JSON and GeoJSON files based on the country code
        const mergedData = jsonData.map(data => {
            const matchingFeature = geojsonData.features.find(feature => feature.properties.ISO_A3 === data["alpha-3"]);
            return {
              ...data,
              ...matchingFeature.geometry
            };
        });
        createCountryMarkers(mergedData);

    });
});

// Create the createCountryMarkers function.
function createCountryMarkers(data) {
    
    // Initialise an array to hold the country markers.
    let countryBorders = L.geoJson(data, {
        
        onEachFeature: function(feature, layer) {

            // Add an event listener to display the popup when hovering over the country marker
            layer.on({
                mouseover: function(event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 0%.
                mouseout: function(event) {
                    layer = event.target;
                    layer.setStyle({
                      fillOpacity: 0.2
                    });
                },
                // // When a feature (country) is clicked, it zooms to fit the screen.
                // click: function(event) {
                //     myMap.fitBounds(event.target.getBounds());
                // }
            });
            let popupHtml = `<h2>${feature.Countries}</h2>`;
            
            // Add the data to the popup if it is not empty
            if (feature["HDI Rank (2021)"]) {
                popupHtml += `<h3>HDI Ranking 2021: ${feature["HDI Rank (2021)"]}</h3>`;
            }
            else {
                popupHtml += `<h3>HDI Ranking 2021: N/A</h3>`;
            }
            if (feature["Human Development Index (HDI)"]){
                popupHtml += `<h3>HDI 2021: ${feature["Human Development Index (HDI)"]}</h3>`;
            }
            else {
                popupHtml += `<h3>HDI 2021: N/A</h3>`;
            }
            if (feature["Education Index"]){
                popupHtml += `<h3>Education index: ${feature["Education Index"]}</h3>`;
            }
            else {
                popupHtml += `<h3>Education index: N/A</h3>`;
            }

            if (feature["crime_index"]) {
                popupHtml += `<h3>Crime index: ${feature["crime_index"]}</h3>`;
            }
            else {
                popupHtml += `<h3>Crime index: N/A</h3>`;
            }

            if (feature["LPP_index"]){
                popupHtml += `<h3>LPP index: ${feature["LPP_index"]}</h3>`;
            }
            else {
                popupHtml += `<h3>LPP index: N/A</h3>`;
            }

            if (feature["healthcare_index"]) {
                popupHtml += `<h3>Healthcare index: ${feature["healthcare_index"]}</h3>`;
            }
            else {
                popupHtml += `<h3>Healthcare index: N/A</h3>`;
            }

            // Bind the popup to the country layer
            layer.bindPopup(popupHtml);
        }

    });
    
    myMap.addLayer(countryBorders);

}