// Declare constants and variables
const positionAPIKey = '3f39be56daa79b8f85d50e3d985d6f6d';
const cityInputEl = $('#search');

var citySearched = 'Oakland';
var cityLat;
var cityLong;
var breweryArray = [];


// function to call the position API to gather the latitude and longitude of the user's search
var callPositionAPI = function (city) {
    var posApiCall = `http://api.positionstack.com/v1/forward?access_key=${positionAPIKey}&query=${city}`;
    fetch(posApiCall)
        .then(response => response.json())
        .then(function (data) {
            cityLat = data.data[0].latitude;
            cityLong = data.data[0].longitude;
            // pass brewery API function here with the lat and long values determined
            callBreweryAPI(cityLat, cityLong);
        });
}

// function to call the brewery API where the latitude and longitude are passed into the API call to gather a list of nearby Breweries
var callBreweryAPI = function (lat, long) {
    var breweryApiCall = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}`;
    fetch(breweryApiCall)
        .then(response => response.json())
        .then(function (data) {
            console.log(data)
            createResults(data);
        });
}

var saveFavorites = function() {
    localStorage.setItem('favorites', breweryArray)
}

/**
 * retrieves data from local storage and adds card elements
 * @returns undefined
 */
var loadFavorites = function() {
    var tempArr = JSON.parse(localStorage.getItem("favorites"))

    if (!tempArr) {
        return false;
    }

    // assign to brewery array
    breweryArray = tempArr

    showCards(breweryArray)

}

/**
 * Handles clearing the card elements and creating the first, then remaining results.
 * @param {*} breweryDataArray 
 */
var showCards = function(breweryDataArray) {
      // clear result wrapper sections
      $('#first-result').html('')
      $('#results-wrapper').html('')
      
      // show first favorite 
      makeFirstResult(breweryDataArray[0])
  
      // loop thru remaining (index 1 to n)
      for (var i = 1; i < breweryDataArray.length; i++) {
          // makeResult(breweryDataArray[i])
      }
}

/**
 * Converts the fetched data to a unified structure between making the cards from results or from loading favorites
 * @param {Array} resultsData 
 * @returns Array
 */
var parseResults = function(resultsData) {
    var tempArr = [];
    for (let res of resultsData) {
        tempArr.push(createBreweryObj(res))
    }
    return tempArr
}

var createResults = function(dataArray) {
    // validate data
    if (!dataArray) {
        return false
    } else {
        dataArray = parseResults(dataArray)
    }

    showCards(dataArray)

}

// NOTE: this info is what we save to use for favorites, we don't need to do another fetch request
/**
 * Returns a stripped and formatted brewery object
 * @param {Object} dataItem 
 * @returns 
 */
var createBreweryObj = function (dataItem) {
    return {
        id:         dataItem.id,
        name:       dataItem.name, // "Ale Industries"
        type:       dataItem.brewery_type, // "micro"
        street:     dataItem.street,
        city:       dataItem.city,
        state:      dataItem.state,
        country:    dataItem.country,
        zip:        dataItem.postal_code,
        phone:      dataItem.phone, // "9254705280"
        url:        dataItem.website_url // "http://www.aleindustries.com"
    }
}

/**
 * ### Creates first result card elements from given brewery info
 * @param {Object} breweryDataObj 
 */
var makeFirstResult = function (brewery) {

    // test functionality
    console.log('making first result', brewery);
    // return early to prevent added errors
    // return false;
    
    // create elements & assign classes
    var $card = $('<div>').addClass("brewery-card w-full bg-yellow-300 lg:bg-gray-100 rounded-lg overflow-hidden lg:p-2 lg:flex lg:basis-1/3")
    var $imgWrapper = $('<div>').addClass("first-img relative lg:rounded overflow-hidden lg:h-44")
    var $favBtn = $('<button>').addClass("favorites absolute left-1 inline-block  text-yellow-300 text-2xl uppercase px-2").text('☆')
    var $img = $('<iframe>').addClass("absolute h-full w-full object-cover").attr({
        'src': brewery.url,
        'scrolling': "no",
        'frameborder': "0"
    })
    var $addressWrapper = $('<address>').addClass("p-2 lg:p-6")
    var $nameEl = $('<h3>').addClass("mt-1 text-yellow-800 leading-tight truncate text-2xl").text(brewery.name)
    var $separator = $("<hr>").addClass("border-yellow-900")
    var $contactWrapper = $('<div>').addClass("mt-2 text-yellow-700 text-xs uppercase font-semibold")
    var $phoneEl = $('<a>').attr('href', 'tel:' + brewery.phone).text(brewery.phone)
    var $url = $('<a>').attr('href', brewery.url).text(brewery.url)

    var addressText = `${brewery.street || ''}, ${brewery.city || ''}, ${brewery.state || ''}, ${brewery.country || ''} ${brewery.zip}`
    var $addressEl = $('<div>').addClass("text-yellow-700 text-xs uppercase").text(addressText)
    
    // assign data-* 'id'
    // append to appropriate parent elements
    $imgWrapper.append($img, $favBtn)
    $addressWrapper.append($nameEl)
    $addressWrapper.append($separator)
    $contactWrapper.append($phoneEl, ' &bull; ', $url)
    $addressWrapper.append($contactWrapper)
    $addressWrapper.append($addressEl)
    $card.append($imgWrapper, $addressWrapper)
    $('#first-result').append($card)
}

callPositionAPI(citySearched);

var submitBtnClicked = function (event) {
    event.preventDefault();
    console.log("A submit button has been clicked!");
    citySearched = cityInputEl.value;
    callPositionAPI(citySearched);
}

$('#search-form').submit(submitBtnClicked)

$('#favorites-button').on("click",loadFavorites)

$('main').on('click','.favorites', function() {
    var currentText = $(this).html()
    var starToggleText = (currentText === '☆') ? '★' : '☆'
    $(this).text(starToggleText)
    // add to/remove from breweries array
    // breweryArray.push(brewery data) // may need to store brewery data elsewhere 
    // save favorites
})