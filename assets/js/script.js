// Declare constants and variables

var breweryArray = [];
var favorites = [];
const validCountries = ['US', 'IE', 'FR', 'GB'];
const $modal = $('.modal');
const $closeButton = $('.close-button');

var imgs = [
    'mateusz-feliksik-1UDj1sTzmzQ-unsplash.jpg','mel-elias-eZZKqB4OPzk-unsplash.jpg', 'patrick-fore-5PRp-FvsI0Q-unsplash.jpg','patrick-fore-rrvAuudnAfg-unsplash.jpg',
    'thais-do-rio-EUO7L470LXk-unsplash.jpg',
    'pradnyal-gandhi-1MqDCpA-2hU-unsplash.jpg'
]

// function to call the position API to gather the latitude and longitude of the user's search
var callPositionAPI = function (location) {
    var posApiCall = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=94e32ddc97880c45b19a69dfc85aec8d`;
    fetch(posApiCall)
        .then(response => {
            if(response.ok) {
                response.json().then(function (data) {
                    var lat = $(data).attr('lat');
                    var long = $(data).attr('lon');
                    var isValidCountry = validCountries.includes($(data).attr('country'));
        
                    // validate country for brewery API
                    if(!isValidCountry) {
                        showModal();
                        return;
                    }
        
                    // pass brewery API function here with the lat and long values determined
                    callBreweryAPI(lat, long);
                    updateMapFrameSrc(location);
                });
            }
        })
}

// Function to show the modal when an invalid country is entered
var showModal = function() {
    $modal.addClass('show-modal').trigger('focus');
}

// function to call the brewery API where the latitude and longitude are passed into the API call to gather a list of nearby Breweries
var callBreweryAPI = function (lat, long) {
    var breweryApiCall = `https://api.openbrewerydb.org/breweries?by_dist=${lat},${long}`;
    fetch(breweryApiCall)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(function (data) {
                        createResults(data);
                    });
                }
            });
}

var saveFavorites = function() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
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

    // remove null items
    for (var i = 0; i < tempArr.length; i++) {
        if(!tempArr[i]) {
            tempArr.remove(i)
        }
    }

    // assign to favorites array
    favorites = tempArr;
    breweryArray = tempArr;

    // clear search input form
    $('#search').val('');
    showCards(favorites);
}

/**
 * Handles clearing the card elements and creating the first, then remaining results.
 * @param {*} breweryDataArray 
 */
var showCards = function(breweryDataArray) {
    // clear result wrapper sections
    $('#first-result').html('');
    $('#results-wrapper').html('');
    
    // show first favorite 
    makeFirstResult(breweryDataArray[0]);

    // loop thru remaining (index 1 to n)
    for (var i = 1; i < breweryDataArray.length; i++) {
        makeRemainingResults(breweryDataArray[i], i);
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
        res = createBreweryObj(res);
        
        // set favorites
        favorites.forEach( item => { 
            if ( res.id === item.id ) {
                res.isFavorite = true;
            }
         })

        tempArr.push(res);
    }
    return tempArr;
}

var createResults = function(dataArray) {
    // validate data
    if (!dataArray) {
        return false;
    } else {
        dataArray = parseResults(dataArray);
        // setting the brewery array to what comes in from search result data
        breweryArray = (dataArray);
    }

    showCards(dataArray);
}

/**
 * Returns a stripped and formatted brewery object
 * @param {Object} dataItem 
 * @returns 
 */
var createBreweryObj = function (dataItem) {
    return {
        id:         dataItem.id,
        name:       dataItem.name,
        type:       dataItem.brewery_type,
        street:     dataItem.street,
        city:       dataItem.city,
        state:      dataItem.state,
        country:    dataItem.country,
        zip:        dataItem.postal_code,
        phone:      dataItem.phone,
        url:        dataItem.website_url,
        isFavorite: false
    }
}

var wrapImgs = function() {
    var img = imgs.shift();
    imgs.push(img);
    return img;
}

/**
 * assigns the card element a data attribute with the brewery id checks if id is in favorites and sets the brewery.isFavorite accordingly
 * @param {Object} brewery 
 * @param {$Object} $card
 */
var addDataAttr = function(brewery, $card) {

    $card.data('meta', brewery);

}

/**
 * toggles the brewery's isFavorite boolean value.
 * @param {Object} brewery 
 * @returns 
 */
var setFavState = function(brewery) {
    // match brewery with favs[i]
    var fav = getFavorite(brewery);
    if ( fav.id === brewery.id ) {
        brewery.isFavorite = false;
        return
    }
    brewery.isFavorite = true;
}

/**
 * Given a brewery object, returns the matching favorites object, otherwise the brewery obj.
 * @param {Oject} brewery 
 * @returns 
 */
var getFavorite = function(brewery) {
    var fav = favorites.filter( favorite => favorite.id === brewery.id );

    if ( fav.length ) {
        return fav;
    }
    return brewery
}


var formatPhone = function(number) {
    // check length
    if ( !number) {
        return '';
    }
    if ( number.length > 10) {
        var cc = number.substring(0,1);
        var area = number.substring(1,4);
        number =  `+${cc} (${area}) ${number.substring(4,7)}-${number.substring(7,number.length)}`;
        return number;
    } 
       
    return `(${number.substring(0,3)}) ${number.substring(3,6)}-${number.substring(6,number.length)}`;
}

var formatUrl = function(breweryUrl) {
    if (!breweryUrl) {
        return '';
    }
    let regex = /.*www.|.*\/\//
    return breweryUrl.replace(regex, '')
}


/**
 * ### Creates first result card elements from given brewery info
 * @param {Object} breweryDataObj 
 */
var makeFirstResult = function (brewery) {

    const imgSource = `./assets/images/${wrapImgs()}`;
    
    // create elements & assign classes
    var $card = $('<div>').addClass("brewery-card w-full bg-yellow-300 lg:bg-gray-100 rounded-lg overflow-hidden lg:p-2 lg:flex lg:basis-1/3").data('id', 0);
    var $imgWrapper = $('<div>').addClass("first-img relative lg:rounded overflow-hidden lg:h-44");
    var $favBtn = $('<button>').addClass("favorites absolute left-1 inline-block  text-yellow-300 text-2xl uppercase px-2");
    var $img = $('<img>').addClass("absolute h-full w-full object-cover").attr({
        'src': imgSource,
        'alt': brewery.name
    })
    var $addressWrapper = $('<address>').addClass("p-2 lg:p-6");
    var $nameEl = $('<h3>').addClass("mt-1 text-yellow-800 leading-tight truncate text-2xl").text(brewery.name);
    var $separator = $("<hr>").addClass("border-yellow-900");
    var $contactWrapper = $('<div>').addClass("mt-2 text-yellow-700 text-xs uppercase font-semibold");
    var $phoneEl = $('<a>').attr('href', 'tel:' + brewery.phone).text(formatPhone(brewery.phone));
    // TODO:
        // Edit the URL so that http:// and https:// are no longer present
    var $url = $('<a>').attr('href', brewery.url).attr( 'target', '_blank').text(formatUrl(brewery.url))

    // assign address text
    // var addressText = `${brewery.street || ''}, ${brewery.city || ''}, ${brewery.state || ''}, ${brewery.country || ''} ${brewery.zip}`;


    var deets = [brewery.street,brewery.city,brewery.state,brewery.country]
    deets = deets.filter(deet => deet !== null)
    
    var addressText = deets.join(', ') + brewery.zip || ''
    var $addressEl = $('<div>').addClass("text-yellow-700 text-xs uppercase").text(addressText);
    
    // assign data attributes 
    $card.data('id', brewery.id);
    $card.data('meta', brewery);
    
    // assign favorites star ⭐ state
    setFavState(brewery);
    var favState = brewery.isFavorite ? '★' : '☆'
    $favBtn.text(favState);
    
    // append to appropriate parent elements
    $imgWrapper.append($img, $favBtn);
    $addressWrapper.append($nameEl);
    $addressWrapper.append($separator);
    if (!brewery.phone || !brewery.url) {
        $contactWrapper.append($phoneEl, $url);
    } else {
        $contactWrapper.append($phoneEl, ' &bull; ', $url);
    }
    $addressWrapper.append($contactWrapper);
    $addressWrapper.append($addressEl);
    $card.append($imgWrapper, $addressWrapper);
    $('#first-result').append($card);
}

var makeRemainingResults = function(brewery, index) {

    const imgSource = `./assets/images/${wrapImgs()}`;
    
    // create elements & assign classes
    var $card = $('<div>').addClass("brewery-card overflow-hidden rounded-lg bg-yellow-300 text-yellow-800");
    var $imgWrapper = $('<div>').addClass("relative img-wrapper w-full max-h-md overflow-hidden ");
    var $favBtn = $('<button>').addClass("favorites absolute left-2 top-2 text-yellow-300 text-4xl").text('☆');
    var $img = $('<img>').addClass('absolute object-cover h-full w-full').attr({
        'src': imgSource,
        'alt': brewery.name
    })
    var $addressWrapper = $('<address>').addClass("brewery-content p-2");
    var $nameEl = $('<h3>').addClass("brewery-name inline text-2xl").text(brewery.name);
    var $separator = $("<hr>").addClass("border-yellow-800 my-1");
    var $contactWrapper = $('<div>').addClass("mt-2 text-yellow-700 text-xs uppercase font-semibold");
    var $phoneEl = $('<a>').attr('href', 'tel:' + brewery.phone).text(formatPhone(brewery.phone));
    var $url = $('<a>').attr('href', brewery.url).addClass('underline lowercase text-blue-500 visited:text-blue-900').attr( 'target', '_blank').text(formatUrl(brewery.url));

    // var addressText = `${brewery.street || ''}, ${brewery.city || ''}, ${brewery.state || ''}, ${brewery.country || ''} ${brewery.zip}`;

    
    var deets = [brewery.street,brewery.city,brewery.state,brewery.country]
    deets = deets.filter(deet => deet !== null)
    
    var addressText = deets.join(', ') + brewery.zip || ''
    var $addressEl = $('<div>').addClass("text-yellow-700 text-xs uppercase").text(addressText);

    // assign data attributes 
    $card.data('id', brewery.id);
    $card.data('meta', brewery);
    
    // assign favorites star ⭐ state
    setFavState(brewery);
    var favState = brewery.isFavorite ? '★' : '☆'
    $favBtn.text(favState);
    
    // append to appropriate parent elements
    $imgWrapper.append($img, $favBtn);
    $addressWrapper.append($nameEl);
    $addressWrapper.append($separator);
    if (!brewery.phone || !brewery.url) {
        $contactWrapper.append($phoneEl, $url);
    } else {
        $contactWrapper.append($phoneEl, ' &bull; ', $url);
    }
    $addressWrapper.append($contactWrapper);
    $addressWrapper.append($addressEl);
    $card.append($imgWrapper, $addressWrapper);
    $('#results-wrapper').append($card);

}

var submitBtnClicked = function (event) {
    event.preventDefault();
    if ( event.target.matches('#favorites-button') ) {
        return false;
    }
    var citySearched = $('#search').val().trim();
    if(!citySearched) {
        $('#search').val('');
        return;
    }
    else if (/\d/.test(citySearched)) {
        $('#search').val('');
        showModal();
        return;
    }
    $('#search').val('');
    callPositionAPI(citySearched);
}

var updateMapFrameSrc = function (location) {
    var $src = $('#map-canvas');
    var location = location.split(" ").join("");
    var regEx = /q=[\D\s]*(?=&)/g;
    var srcText = $src
        .attr('src')
        .replace(regEx, "q=" + location);
    $src.attr('src', srcText);
}

$('#search-form').submit(submitBtnClicked);

$('#favorites-button').on("click",loadFavorites);

$('main').on('click','.favorites', function() {

    // brewery meta data
    var brewery = $(this).parents('.brewery-card').data('meta');

    // get item matching id
    if (brewery.isFavorite) {
        // remove from favorites
        favorites = favorites.filter(fav => fav.id !== brewery.id);
        brewery.isFavorite = false;
        $(this).text('☆')
    } else {
        // add to favorites (sorted by latestStarred=desc)
        favorites.unshift(brewery);
        brewery.isFavorite = true;
        $(this).text('★')
    }
    
    // Save fav array to local storage
    saveFavorites();
})

loadFavorites();

// event listeners for click and escape key press
$closeButton.on('click', function() {
    $modal.removeClass('show-modal');
});

$(document).keydown(function(e) { 
    if (e.keyCode === 27) {
        // add a check to see if the modal already has a show-modal class
        if($modal.hasClass('show-modal')) {
            $modal.removeClass('show-modal')
        }
    } 
});