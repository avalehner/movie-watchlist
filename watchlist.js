let watchlistArr = []
const watchlistContainer = document.getElementById('watch-list-container')

handleWatchlistDisplay()

// event listeners 
document.addEventListener ('click', (e) => {
  if (e.target.dataset.remove) {
    removeWatchlist(e.target.dataset.remove)
  }
})

// functions 
function renderMoviesFromId(imdbID) {
  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=2d86dd0a`)
    .then(res => res.json())
    .then(data => {
      console.log(data)

        let watchlistHtml = `
        <div id="${data.imdbID}">
          <div class="movie-container">
            <img class="poster" src="${data.Poster}">
            <div class="movie-info-container">
              <div class="movie-title-container">
                <h3 class="movie-title">${data.Title}</h3>
                <img class="star-icon" src="images/star-icon.png"/>
                <p class="movie-rating">${data.imdbRating}
              </div>
              <div class="movie-data-container">
                <p class="runtime">${data.Runtime}</p>
                <p class="genre">${data.Genre}</p>
                <div id="remove-watchlist-container" class="remove-watchlist-container">
                  <img id="remove-icon" class="remove-icon" 
                  src="images/remove-icon.png" 
                  data-remove="${data.imdbID}">
                  <p class="remove-icon">Remove</p>
                </div>
              </div>
              <p class="movie-plot">${data.Plot}</p>
            </div>
          </div>
          <hr/>
        </div>`
      
      watchlistContainer.innerHTML += watchlistHtml
  })
}


function removeWatchlist(imdbID) {
  const removedMovieIndex = watchlistArr.indexOf(imdbID)
  watchlistArr.splice(removedMovieIndex, 1)
  console.log(watchlistArr)

  // setting local storage again so removed item is gone
  localStorage.setItem('movies', JSON.stringify(watchlistArr))

  //removing item visually 
  document.getElementById(imdbID).style.display = 'none'

  //reload empty message
  handleWatchlistDisplay ()

}

function handleWatchlistDisplay () {
const moviesFromLocalStorage = JSON.parse(localStorage.getItem('movies'))
  if (moviesFromLocalStorage.length !== 0) {
    //get movies from local storage 
      watchlistArr = moviesFromLocalStorage
      watchlistArr.forEach(imdbID => renderMoviesFromId(imdbID))
    
      document.getElementById('empty-watchlist-msg').style.display ='none'
      watchlistContainer.style.display = 'block'
    } else {
       document.getElementById('empty-watchlist-msg').style.display ='block'
       watchlistContainer.style.display = 'none'
    }
}