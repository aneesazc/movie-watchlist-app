const searchBtn = document.getElementById("search-btn")
const userInput = document.getElementById("search-input")
const mainContainer = document.getElementById("search-results-container")
// const watchlistContainers = document.getElementsByClassName("watchlist")

// let watchlistLocalStorage = localStorage.getItem("myMovieWatchlist") ? JSON.parse(localStorage.getItem("myMovieWatchlist")) : []

const apiKey = "9376a0a9"
const starIcon = "images/icons8-star-48.png"
const plusIcon = "images/icons8-plus-+-30.png"
const minusIcon = "images/icons8-minus-30.png"
const missingImg = "images/unavailable-icon.png"

searchBtn.addEventListener("click", searchMovie)

async function searchMovie(){
    let movieHtml = ""
    let res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${userInput.value}`)
    let data = await res.json()
    
    
    if(data.Response === "True") {
        const movieIds = data.Search.map(movie => movie.imdbID)
        
        // Loop through each movie Id
        let movieSearchHtmlArray = []
        for(id of movieIds) {
            let url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`
            res = await fetch(url)
            data = await res.json()
            let movie = {
                posterUrl: data.Poster === "N/A" ? missingImg : data.Poster,
                title: data.Title,
                rating: data.Ratings.length > 0 ? data.Ratings[0].Value.slice(0, 3) : "",
                duration: data.Runtime,
                genre: data.Genre,
                description: data.Plot       
                }
            movieHtml += getMovieHtml(movie)
            movieSearchHtmlArray.push(getMovieHtml(movie, "remove") )     
        }
        
        mainContainer.innerHTML = movieHtml
        const watchlistButtons = document.querySelectorAll(".watchlist");

        watchlistButtons.forEach((btn, index) => {
            btn.addEventListener("click", function() {
                const movieToAdd = movieIds[index];
                addToWatchlist(movieToAdd);
            })
        })
        
    } else {
        mainContainer.innerHTML = `<p class="bad-search">Unable to find what you’re looking for. Please try another search.</p>`
    }
}

function getMovieHtml(data, btnType = "add") {
    const {posterUrl, title, rating, duration, genre, description} = data
    
    const addBtnHtml = `<img class="icon" src="${plusIcon}">
                            <p class="p2">Watchlist</p>`
    const removeBtnHtml = `<img class="icon" src="${minusIcon}">
                            <p class="p2">Remove</p>`
    
    return `<div class='card'>
                <img id="poster" src="${posterUrl}">
                <div class="card-text">
                    
                    <div class="card-header">
                        <p class="movie-title">${title}</p>
                        <div class="icon-text">
                            <img class="icon" src="${starIcon}">
                            <p class="p2">${rating}</p>
                        </div>
                    </div>
                    
                    <div class="card-details">
                        <p class="movie-dur p2">${duration}</p>
                        <p class="movie-genre p2">${genre}</p>
                        <div class="icon-text watchlist">
                            ${btnType === "add" ? addBtnHtml : btnType === "remove" ? removeBtnHtml : ""}
                        </div>
                    </div>
                    
                   
                    <p class="movie-desc">${description}</p>
                     
                </div>
            </div> <hr>`
}


function addToWatchlist(movieId) {
    let watchlist = localStorage.getItem("watchlist") 
                    ? JSON.parse(localStorage.getItem("watchlist")) 
                    : []

    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId)
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
}
