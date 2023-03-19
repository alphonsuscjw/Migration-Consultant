var map = L.map('map').setView([37, 70], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define colors for each HDI range
var lowColor = 'red';
var mediumColor = 'orange';
var highColor = 'yellow';
var veryHighColor = 'green';

// Update marker icon and size based on HDI value
function getMarkerIcon(hdi) {
  var iconUrl = '';
  var iconSize = [0, 0];
  if (hdi < 0.550) {
    iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png';
    iconSize = [15, 20];
  } else if (hdi >= 0.550 && hdi < 0.700) {
    iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png';
    iconSize = [21, 25];
  } else if (hdi >= 0.700 && hdi < 0.800) {
    iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png';
    iconSize = [26, 30];
  } else {
    iconUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png';
    iconSize = [31, 35];
  }
  return L.icon({ iconUrl: iconUrl, iconSize: iconSize, iconAnchor: [Math.floor(iconSize[0]/2), iconSize[1]] });
}

// Create markers for each country and add to map
fetch('/api/hdi')
  .then(response => response.json())
  .then(data => {
    data.forEach(country => {
      var marker = L.marker([country.Lat, country.Lon], { icon: getMarkerIcon(country['Human Development Index (HDI)']) }).addTo(map);
      var popupContent = `
        <strong>${country.Countries}</strong><br>
        HDI: ${country['Human Development Index (HDI)']}<br>
        Life expectancy: ${country['Life expectancy at birth']}<br>
        Education index: ${country['Education Index']}
      `;
      marker.bindPopup(popupContent);
    });
  });


