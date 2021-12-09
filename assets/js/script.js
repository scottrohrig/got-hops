const positionAPIKey = '3f39be56daa79b8f85d50e3d985d6f6d';
var city = 'Oakland';
var cityLat;
var cityLong;

var posApiCall = `http://api.positionstack.com/v1/forward?access_key=${positionAPIKey}&query=${city}`

var testPositionAPI = function() {
    fetch(posApiCall)
        .then(response => response.json())
        .then(function(data) {
            cityLat = data.data[0].latitude;
            cityLong = data.data[0].longitude;
            console.log(cityLat, cityLong)
            testBreweryAPI(cityLat, cityLong);
        })
}


var testBreweryAPI = function(lat, long) {
    var breweryApiCall = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}`;
    fetch(breweryApiCall)
        .then(response => response.json())
        .then(function(data) {
            console.log(data)
        })
}

testPositionAPI();
