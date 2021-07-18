// Map and JSON URL Variables
var json_data_earthquakes = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
var json_data_tectonic = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

    // Layers Variables
    var layer_satelite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 26,
      id: "satellite-v9",
      accessToken: API_KEY
    });

    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 26,
      id: "light-v10",
      accessToken: API_KEY
    });

    var layer_outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 26,
      id: "outdoors-v11",
      accessToken: API_KEY
    });

    // Base Maps
    var base_maps = {
        Satelite: layer_satelite,
        Grayscale: light,
        Outdoors: layer_outdoors
    };

// Create Earth Quake Markers

// GeoJSON
d3.json(json_data_earthquakes).then(data=>{

    var earthquake_markers = [];
    data.features.forEach(earthquake_data=>{
        earthquake_markers.push(
            L.circle([earthquake_data.geometry.coordinates[1],earthquake_data.geometry.coordinates[0]], {
                color: 'white',
                weight: .7,
                fillColor: getColor(earthquake_data.properties.mag), // Color on Magnitude
                fillOpacity: 0.7,
                radius: 22000 * earthquake_data.properties.mag // Radius on Magnitude
              }).bindPopup(`Earthquake Magnitude:<h4>${earthquake_data.properties.mag}</h4><hr>Location:<br>${earthquake_data.properties.place}`) //Add popup when clicked w/ more info
        );
    })
    var earthquake_layer = L.layerGroup(earthquake_markers);

    // Tectonic Lines Layer

    // GeoJSON

    d3.json(json_data_tectonic).then(data=>{

      var lines_bound = [];
      data.features.forEach(fl=>{
  
          lines_bound.push(
              L.geoJSON([fl.geometry]) // Popup Info
          );
      })
      var layer_bound = L.layerGroup(lines_bound);

      // Toggle Overlays
      var overlay_maps = {
        'Fault Lines': layer_bound,
        Earthquakes: earthquake_layer
      };

      // Map Object
      var mymap = L.map("map", {
        center: [33.720000,-112.460000],
        zoom: 4,
        layers: [light, earthquake_layer, layer_bound]
      });

      // Control Map Layers
      L.control.layers(base_maps, overlay_maps).addTo(mymap);

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
    })
    .catch(e=>{
        console.log(e)
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
