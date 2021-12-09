// Declare constants and variables
const positionAPIKey = '3f39be56daa79b8f85d50e3d985d6f6d';
var city = 'Oakland';
var cityLat;
var cityLong;

// function to call the position API to gather the latitude and longitude of the user's search
var callPositionAPI = function() {
    var posApiCall = `http://api.positionstack.com/v1/forward?access_key=${positionAPIKey}&query=${city}`;
    fetch(posApiCall)
        .then(response => response.json())
        .then(function(data) {
            cityLat = data.data[0].latitude;
            cityLong = data.data[0].longitude;
            // pass brewery API function here with the lat and long values determined
            callBreweryAPI(cityLat, cityLong);
        });
}

// function to call the brewery API where the latitude and longitude are passed into the API call to gather a list of nearby Breweries
var callBreweryAPI = function(lat, long) {
    var breweryApiCall = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}`;
    fetch(breweryApiCall)
        .then(response => response.json())
        .then(function(data) {
            console.log(data)
        });
}

testPositionAPI();