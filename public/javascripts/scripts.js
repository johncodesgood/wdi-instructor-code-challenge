function getMovieList() {
  // Get the search terms that the user submitted and then create the URL string
  // for the OMDB API request
  var searchTerm = document.getElementById('search-input').value;
  var apiUrl = 'https://www.omdbapi.com/?s=' + searchTerm;
  // Call the function that makes the actual API request
  ombdApiRequest(apiUrl);
  document.getElementById('search-input').value = "";
}

function ombdApiRequest(apiUrl) {
  // Make a GET request to the OMDB API and then call the functions
  // that will display the response on the page
  var request = new XMLHttpRequest();
  request.open('GET', apiUrl, true);
  request.onload = function() {
    // A status of 200 means that the GET request was successful
    if (request.status == 200) {
      // The data comes back as a string so it needs to be converted to a JSON object
      var responseMovieJSON = JSON.parse(request.responseText);
      // Determine if the request was a keyword search or a movie title search and 
      // call the corresponding function to display the results
      if (apiUrl.charAt(24) === 's') {
        var responseMovieList = responseMovieJSON.Search;
        showMovieList(responseMovieList);
      } else {
        showMovieDetails(responseMovieJSON);
      }
    }
  };
  request.send();
}

function showMovieList(responseMovieList){
  // Show the movies that were retrieved from the OMDB request by
  // iterating through each item in the response and appending the
  // movie title to the DOM (and make it a link).
  clearPage();
  var movieList = document.getElementById('page-list');
  responseMovieList.forEach(function(movie) {
    var newMovieLink = document.createElement('a');
    newMovieLink.textContent = movie['Title'];
    newMovieLink.setAttribute('href', "#");
    var newMovieItem = document.createElement('li');
    newMovieItem.appendChild(newMovieLink);
    movieList.appendChild(newMovieItem);
    // To create a link for each item, add "onclick" attribute to each li 
    newMovieItem.onclick = function(){
      var movieTitle = this.firstChild.text;
      getMovieDetails(movieTitle);
    };
  }) 
}

function getMovieDetails(movieTitle){
  // Create the URL string and then call the function that makes the API request
  var apiUrl = 'https://www.omdbapi.com/?t=' + movieTitle;
  ombdApiRequest(apiUrl);
}

function showMovieDetails(responseMovieDetails){
  // Show the movie details that were retrieved from the OMDB request by 
  // iterating through item in the response and appending each item 
  // to the DOM
  clearPage();
  var movieDetails = document.getElementById('page-list');
  // Create a 'Save as Favorite' button that will store this movie to the user's favorites.
  // Set the movie 'Title' and 'imbdID' as attributes in the button so they can be easily
  // accessed.
  var favoriteButton = document.createElement('button');
  favoriteButton.setAttribute('onclick', 'saveFavorites()');
  favoriteButton.setAttribute('title', responseMovieDetails['Title']);
  favoriteButton.setAttribute('oid', responseMovieDetails['imdbID']);
  favoriteButton.appendChild(document.createTextNode('Save as Favorite'));
  movieDetails.appendChild(favoriteButton);
  for (var key in responseMovieDetails) {
    var movieDetailText = key + " : " + responseMovieDetails[key];
    var movieDetailItem = document.createElement('li');
    movieDetailItem.appendChild(document.createTextNode(movieDetailText));
    movieDetails.appendChild(movieDetailItem);
  }
}

function getFavorites() {
  // Retrieve all of the movies that the user favorited by sending a GET request
  // to the /favorites route in app.rb 
  var request = new XMLHttpRequest();
  request.open('GET', '/favorites', true);
  // Set the data to come back in JSON format to make it easier to manipulate
  request.setRequestHeader('Content-Type', 'application/json');
  request.onload = function() {
    // A status of 200 means that the GET request was successful
    if (request.status === 200) {
      clearPage();
      // The response comes back as a string so it needs to be parsed into JSON
      var favoriteMovieList = JSON.parse(request.responseText);
      var movieList = document.getElementById('page-list');
      // Iterate over each movie in the favorites list and add the title to the DOM
      for (var key in favoriteMovieList) {
        var favoritesList = key;
        var favoritesItem = document.createElement('li');
        favoritesItem.appendChild(document.createTextNode(favoritesList));
        movieList.appendChild(favoritesItem);
      }
    }
  };
  request.send();
}

function saveFavorites() {
  // Save off the movie that the user favorited by sending a POST request
  // to the /favorties route in app.rb. The name and id of the movie are 
  // passed as parameters.
  var request = new XMLHttpRequest();
  var movieDetails = document.getElementById('page-list');
  var movieTitle = movieDetails.firstChild.getAttribute('title');
  var movieOid = movieDetails.firstChild.getAttribute('oid');
  request.open('POST', '/favorites');
  // Tell the server the format of the data that is being sent
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // Create the string of parameters to send in the URL string
  var data = "name=" + movieTitle + "&oid=" + movieOid;
  request.send(data);
}


function clearPage() {
  // Clear the data currently displayed on the page
  // Note: One simple way to remove all child elements in a list is to run a loop that keeps
  // removing the first child element until no more first child elements exist
  var movieList = document.getElementById('page-list');
  while (movieList.firstChild) {
    movieList.removeChild(movieList.firstChild);
  }
}

function keyPressed(event){
  // Allow the user to hit the enter key to initiate a movie search in addition
  // to hitting the 'Submit' button. A Key Code of 13 corresponds to the 
  // 'enter/return' key.
  if (event.keyCode == 13) {
    document.getElementById('search-button').click();
  }
}