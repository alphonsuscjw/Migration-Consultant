// Perform an API call to the USGS API to get the earthquake information. Call createMarkers when it completes.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(createMarkers);

// Create the createMarkers function.
function createMarkers(response) {
    
    // Pull the "features" property from response.features.
    let eq_features = response.features;
    // Initialise an array to hold the earthquake markers.
    let eqMarkers = [];
    // Loop through the features array.
    for (let i=0; i< eq_features.length; i++) {  
      // For each feature, create a circle marker, and bind a popup with the earthquake's magnitude, depth, place and time.
      let eqMarker = L.circle([eq_features[i].geometry.coordinates[1], eq_features[i].geometry.coordinates[0]], {
        radius: eq_features[i].properties.mag * 40000, // radius changes in proportion to the magnitude
        fillColor: getColor(eq_features[i].geometry.coordinates[2]), // the greater the depth, the darker the fill colour
        color: getColor(eq_features[i].geometry.coordinates[2]), // the greater the depth, the darker the colour
        weight: 1,
        opacity: 1,
        fillOpacity: 0.75
      })
      .bindPopup(`<h3>Magnitude: ${eq_features[i].properties.mag}</h3>
      <h3>Depth: ${eq_features[i].geometry.coordinates[2]} km</h3>
      <h3>Place: ${eq_features[i].properties.place}</h3>
      <h3>Time: ${new Date(eq_features[i].properties.time)}</h3>`);
      
      // Add the marker to the eqMarkers array.
      eqMarkers.push(eqMarker)
    }

    // Create a layer group that's made from the earthquake markers array, and pass it to the createMap function.
    createMap(L.layerGroup(eqMarkers));
}

// Create the createMap function.
function createMap(eqMarkers) {
    // Create the street map tile layer that will be the background of our map.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the topographic map tile layer that will be the background of our map.
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object to hold the base maps layer.
    let baseMaps = {
        Street: street,
        Topo: topo
    };

    // Create an overlayMaps object to hold the eqMarkers layer.
    let overlayMaps = {
        Earthquakes: eqMarkers
    };

    // Create the map object with options.
    let myMap = L.map("map", {
        center: [4.3995, 113.9914],
        zoom: 3,
        layers: [street, eqMarkers]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);

    // Set up the legend for the different colours
    setLegend(myMap);
}

// Function to set the colour of earthquake markers according to their depth
// The greater the depth, the darker the colour
function getColor(depth) {
    if (depth < 10) {
        return "yellow";
    } else if (depth >= 10 && depth < 30){
        return "orange";
    } else if (depth >= 30 && depth < 50){
        return "#eb6223";
    } else if (depth >= 50 && depth < 70){
        return "red";
    } else if (depth >= 70 && depth < 90){
        return "#8a1e1e";
    } else if (depth >= 90){
        return "#360b0b";
    }
}

// Function to set up the legend
function setLegend(myMap) {
    
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let depths = [-10, 10, 30, 50, 70, 90];
        let colors = ["yellow", "orange", "#eb6223", "red", "#8a1e1e", "#360b0b"];
        let labels = [];

        // Set the labels
        for (let i = 0; i < depths.length; i++) {
            let label = depths[i] + (i === depths.length - 1 ? "+" : "-" + depths[i+1]); // Add a + sign to "90" at the last iteration 
            labels.push(label);
        }
        
        // Set up the coloured boxes with their corresponding labels
        for (let i = 0; i < labels.length; i++) {
            let item = `<div><li style="background:${colors[i]}"></li> ${labels[i]}</div>`;
            div.innerHTML += "<ul>" + item + "</ul>";
        }

        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
}