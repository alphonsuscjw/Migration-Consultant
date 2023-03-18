var map = L.map('map').setView([28, 77], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);


var hdiData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Switzerland",
                "hdi": 0.962
            },
            "geometry": {
                "type": "Point",
                "coordinates": [47, 8]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Norway",
                "hdi": 0.961
            },
            "geometry": {
                "type": "Point",
                "coordinates": [62, 10]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "name": "Iceland",
                "hdi": 0.959
            },
            "geometry": {
                "type": "Point",
                "coordinates": [65, -18]
            }
        }
    ]
};

L.geoJSON(hdiData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.name + "</strong><br>HDI: " + feature.properties.hdi);
    }
}).addTo(map);
