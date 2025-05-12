const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const movieListContainer = document.getElementById('movie-list-container')
const moviesFromLocalStorage = JSON.parse(localStorage.getItem('movies'))
let searchListArr = []
let imdbIDArr = []
let watchlistArr = []

//get movies from local storage 
if (moviesFromLocalStorage) {
  watchlistArr = moviesFromLocalStorage
}

// event listeners 
searchBtn.addEventListener('click', ()=>{
  document.getElementById('main-container').style.alignItems = 'flex-start'
  document.getElementById('main-container').style.height = '100%'
  document.getElementById('explore-img').style.display = 'none'
  document.getElementById('error-msg').style.display = 'none'
  movieListContainer.style.display = 'block'

  fetchMoviesFromSearch()
})

document.addEventListener ('click', (e) => {
  if (e.target.dataset.add) {
    addWatchlist(e.target.dataset.add)
  }
})

searchInput.addEventListener('keypress', (e) => {
  if (e.key == 'Enter') searchBtn.click()
})

// functions

function fetchMoviesFromSearch () {
  const movieTitle = searchInput.value
  if (!movieTitle) return

  fetch(`https://www.omdbapi.com/?s=${movieTitle}&apikey=2d86dd0a`)
    .then(res => res.json())
    .then(movies => {
      if (movies.Response === "False") {
        document.getElementById('error-msg').style.display = 'block'
      } else {
        const moviesArr = movies.Search

        //get imdbID from returned array and add to searchArr
        moviesArr.forEach(movie => imdbIDArr.push(movie.imdbID))

        //render movies for each imdbID
        imdbIDArr.forEach(imdbID => renderMoviesFromId(imdbID))
      }
  })
}

function renderMoviesFromId(imdbID) {
  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=2d86dd0a`)
    .then(res => res.json())
    .then(movies => {
        let searchListHtml = `
          <div class="movie-container" id="${movies.imdbID}">
            <img class="poster" src="${movies.Poster}">
            <div class="movie-info-container">
              <div class="movie-title-container">
                <h3 class="movie-title">${movies.Title}</h3>
                <img class="star-icon" src="images/star-icon.png">
                <p class="movie-rating">${movies.imdbRating}
              </div>
              <div class="movie-data-container">
                <p class="runtime">${movies.Runtime}</p>
                <p class="genre">${movies.Genre}</p>
                <div id="add-watchlist-container" class="add-watchlist-container">
                  <img id="add-icon" class="add-icon" 
                  src="images/add-icon.png" 
                  data-add="${movies.imdbID}">
                  <p class="watchlist" data-add="${movies.imdbID}">Watchlist</p>
                </div>
              </div>
              <p class="movie-plot">${movies.Plot}</p>
            </div>
          </div>
        <hr/>`
        movieListContainer.innerHTML += searchListHtml
    })
}

function addWatchlist(imdbID) {
  if (watchlistArr.includes(imdbID)) return 
  watchlistArr.push(imdbID)

  // add movies to local storage for watchlist 
  localStorage.setItem('movies', JSON.stringify(watchlistArr))

  fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=2d86dd0a`)
  .then(res => res.json())
  .then(movie => {alert(`Added '${movie.Title}' to watchlist!`)})
}