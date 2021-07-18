// Map and JSON URL Variables
var mymap = L.map('map').setView([33.720000,-112.460000], 4);
var json_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Map Layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 520,
  maxZoom: 26,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
}).addTo(mymap);

// GeoJSON
d3.json(json_url).then(data=>{

    data.features.forEach(earthquake_data=>{
        L.circle([earthquake_data.geometry.coordinates[1],earthquake_data.geometry.coordinates[0]], {
            color: 'white',
            weight: .7,
            fillColor: getColor(earthquake_data.properties.mag), // Color on Magnitude
            fillOpacity: 0.7,
            radius: 22000 * earthquake_data.properties.mag // Radius on Magnitude
          }).bindPopup(`Earthquake Magnitude:<h4>${earthquake_data.properties.mag}</h4><hr>Location:<br>${earthquake_data.properties.place}`).addTo(mymap); //Add popup when clicked w/ more info
    })
})
.catch(e=>{
    console.log(e)
})

/**
 * Earthquake Magnitude Color
 * @param {number} magnitude Earthquake Magnitude
 */
function getColor(magnitude) {
    return magnitude > 5    ? '#B22222' :
           magnitude > 4    ? '#FF4500' :
           magnitude > 3    ? '#FFDAB9' :
           magnitude > 2    ? '#FFFF00' :
           magnitude > 1    ? '#3CB371' :
                      '#00FA9A' ;
}

// Legend
var magnitude_legend = L.control({position: 'bottomright'});
magnitude_legend.onAdd = function (map) {
    var magnitude_div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];
    // Color Labels
    for (var i = 0; i < grades.length; i++) {
        magnitude_div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return magnitude_div;
};
magnitude_legend.addTo(mymap);

