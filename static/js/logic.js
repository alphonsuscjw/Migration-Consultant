// Initialize the map object
var myMap = L.map('map', {
    center: [28.679079, 77.069710],
    zoom: 3
});

// Add a tile layer to the map using the OpenStreetMap tile server
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(myMap);

// Define the URL for the earthquake data
const queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Use D3 to query the USGS GeoJSON feed and plot the earthquakes on the map
d3.json(queryUrl).then((data) => {
  const earthquakes = data.features;
  const markers = earthquakes.map(createMarker);
  addMarkersToMap(markers);
});

// Define a function to create a marker for each earthquake
function createMarker(earthquake) {
  const lat = earthquake.geometry.coordinates[1];
  const lng = earthquake.geometry.coordinates[0];
  const mag = earthquake.properties.mag;
  const depth = earthquake.geometry.coordinates[2];

  // Define the marker options based on the earthquake properties
  const options = {
    radius: getSize(mag),
    color: getColor(depth),
    fillOpacity: 0.7,
  };

  // Create the marker and add a popup with additional information
  const marker = L.circleMarker([lat, lng], options)
    .bindPopup(`<b>Magnitude:</b> ${mag}<br><b>Depth:</b> ${depth}`)
    .on('mouseover', function (e) {
        this.openPopup();
    })
    .on('mouseout', function (e) {
        this.closePopup();
    });

  // Return the marker
  return marker;
}

// Define a function to add each marker to the map
function addMarkersToMap(markers) {
  markers.forEach((marker) => marker.addTo(myMap));
}

// Define a function to calculate the marker size based on earthquake magnitude
function getSize(magnitude) {
  return magnitude * 4;
}

// Define a function to calculate the marker color based on earthquake depth
function getColor(depth) {
    return depth > 150 ? "#850729" :
           depth > 90 ? "#e31a1c" :
           depth > 70 ? "#fc4e2a" :
           depth > 50 ? "#fd8d3c" :
           depth > 30 ? "#feb24c" :
           depth > 10 ? "#fed976" :
                        "#ffffb2";
  }

// Create a legend for the earthquake depth colors
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (myMap) {
    const div = L.DomUtil.create('div', 'info legend');
    const grades = [-10, 10, 30, 50, 70, 90, 150];
    const labels = [];

    // Loop through the grades and create labels with colored squares
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);


