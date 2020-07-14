<<<<<<< HEAD

=======
>>>>>>> ccfe8dc2e5e7ca2a6504f6b539ecba85863074c9
// Adding tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});


var layers = {
  Publix: new L.LayerGroup(),
  Traders: new L.LayerGroup(),
  WholeFoods: new L.LayerGroup(),
  Kroger: new L.LayerGroup()
}


// Creating map object
var myMap = L.map("map", {
  center: [33.749, -84.388],
  zoom: 11,
  layers: [
    layers.Publix,
    layers.Traders,
    layers.WholeFoods,
    layers.Kroger
  ]
});

streetmap.addTo(myMap);

var overlays = {
  "Publix": layers.Publix,
  "Trader Joe's": layers.Traders,
  "Whole Foods": layers.WholeFoods,
  "Kroger": layers.Kroger
};

L.control.layers(null, overlays).addTo(myMap);

// Load in geojson data
var geoData = "static/data/Education_by_District_2018.geojson";
var publixLocation = "static/data/PublixLocations.json";
var traderLocation = "static/data/TraderJoesLocations.json";
var wholeFoodsLocation = "static/data/WholeFoodsLocations.json";
var krogerLocation = "static/data/KrogerLocations.json";


var publix;
var traders;
var whole;
var krogers;

var geojson;
var publixLatLon = [];
var traderLatLon = [];
var wholeLatLon = [];
var krogerLatLon = [];

var icons = {
  Publix: L.ExtraMarkers.icon({
    // icon: "ion-settings",
    iconColor: "white",
    markerColor: "green",
    shape: "circle"
  }),
  Traders: L.ExtraMarkers.icon({
    // icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  }),
  WholeFoods: L.ExtraMarkers.icon({
    // icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "purple",
    shape: "penta"
  }),
  Kroger: L.ExtraMarkers.icon({
    // icon: "ion-minus-circled",
    iconColor: "white",
    markerColor: "pink",
    shape: "square"
  })
};

// Function to check exception list to determine if a listing is on the exception list and if so to remove the marker
function returnInside(address){
  for (var j=0; j<exclusionList.length; j++) {
  if(address.includes(exclusionList[j]))
      return true;
  }
}

var exclusionList = ["2090 Dunwoody Club Dr", "2969 N Druid Hills", "5930 Roswell Rd", "5001 Peachtree Blvd",
"2036 Johnson Ferry Rd NE", "4920 Roswell Rd", "3855 Buford Hwy NE", "3871 Peachtree Rd NE",
"2205 Lavista Rd NE", "4715 S Atlanta Rd SE"];

function getLatLon(jsonData, store, storeType) {
  for (var i = 0; i < jsonData.length; i++) {
    if (jsonData[i].formatted_address.includes("Atlanta") && !(returnInside(jsonData[i].formatted_address)))
      {
        var location = [jsonData[i].geometry.location.lat, jsonData[i].geometry.location.lng];
        var newMarker = L.marker(location, {
        icon: icons[storeType]
      });
        newMarker.addTo(layers[storeType]);
        newMarker.bindPopup("<h6>"+jsonData[i].name+"<br>"+jsonData[i].formatted_address)
      }    
  }
}


// Grab data with d3
d3.json(geoData, function(data) {

  // Create a new choropleth layer
  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: (feature) => feature.properties.pNoHS_e18+feature.properties.pSomeHS_e18+feature.properties.pHSGrad_e18,

    // Set color scale
    scale: ["#bb8fce", "#1a5276"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Area is: " + feature.properties.NAME + "<br>% Residents with H.S Diploma <br> or Lower:<br>" + 
        (feature.properties.pNoHS_e18+feature.properties.pSomeHS_e18+feature.properties.pHSGrad_e18).toPrecision(3));
    }
  }).addTo(myMap);

  

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h5><strong>% Residents with <br> H.S. Diploma or Lower</strong></h5>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0].toPrecision(3) + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

});

d3.json(publixLocation, function(location) {
  getLatLon(location.results, publixLatLon, "Publix");
  publix = L.layerGroup(publixLatLon);

});

d3.json(traderLocation , function(location) {
  getLatLon(location.results, traderLatLon, "Traders");
  traders = L.layerGroup(traderLatLon);

});

d3.json(wholeFoodsLocation , function(location) {
  getLatLon(location.results, traderLatLon, "WholeFoods");
  traders = L.layerGroup(wholeLatLon);

});

d3.json(krogerLocation, function(location) {
  getLatLon(location.results, traderLatLon, "Kroger");
  krogers = L.layerGroup(krogerLatLon);

});
