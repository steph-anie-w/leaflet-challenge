// Store the url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Create map & add tile layer
var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Color by depth
function chooseColor(depth) {
    if (depth < 10) return 'lightgreen';
    else if (depth < 30) return 'yellow';
    else if (depth < 50) return 'gold';
    else if (depth < 70) return 'orange';
    else if (depth < 90) return 'orangered';
    else return 'red';
}

// d3
d3.json(url).then(function(data) {
    console.log(data);
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return new L.circleMarker(latlng, {
                radius: 2 * (feature.properties.mag),
                color: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.7,
                weight: 1
            })
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>` + feature.properties.place + `</h3><hr><p>` + (new Date(feature.properties.time))
             + `</p><hr><p>Magnitude: ` + feature.properties.mag + `</p><hr><p>Depth: ` + feature.geometry.coordinates[2] + `</p>`);
        }
    }).addTo(map);
    var legend = L.control({position: `bottomright`});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create(`div`, `info legend`);
        depth = [-10, 10, 30, 50, 70, 90];
        div.innerHTML += `<h3 style='text-align: center'>Depth</h3>`
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
        `<li style=\"background-color:` + chooseColor(depth[i] + 1) + `"></li> ` + depth[i] 
        + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '</br>' : '+');
        };
    return div;
    };
    legend.addTo(map);
});
