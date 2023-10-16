const apiKey = "9376a0a9"
const starIcon = "images/icons8-star-48.png"
const plusIcon = "images/icons8-plus-+-30.png"
const minusIcon = "images/icons8-minus-30.png"
const missingImg = "images/unavailable-icon.png"


function getWatchlistMovieHtml(data) {
    const {posterUrl, title, rating, duration, genre, description} = data
    
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
                            ${removeBtnHtml}
                        </div>
                    </div>
                    
                    <p class="movie-desc">${description}</p>
                     
                </div>
            </div> <hr>`
}

function removeFromWatchlist(movieId) {
    let watchlist = localStorage.getItem("watchlist") 
                    ? JSON.parse(localStorage.getItem("watchlist")) 
                    : []

    const index = watchlist.indexOf(movieId)
    if (index !== -1) {
        watchlist.splice(index, 1);  // Removes the movieId from the watchlist array
        localStorage.setItem("watchlist", JSON.stringify(watchlist))
    }
    if (watchlist.length === 0) {
        const watchlistContainer = document.getElementById("watchlist-container")
        watchlistContainer.innerHTML = `<h3>Your watchlist is looking a little empty...</h3>
            <a id="indexPageLink" href="./index.html">Let's add some movies!</a>`
    }
}


document.addEventListener("DOMContentLoaded", async function() {
    let watchlist = localStorage.getItem("watchlist") 
                    ? JSON.parse(localStorage.getItem("watchlist")) 
                    : []

    const watchlistContainer = document.getElementById("watchlist-container");

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML = `<h3>Your watchlist is looking a little empty...</h3>
            <a id="indexPageLink" href="./index.html">Let's add some movies!</a>`;
        return
    }

    watchlistContainer.innerHTML = ""; // clear the "empty" message

    for (let movieId of watchlist) {
        let response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`);
        let data = await response.json();
        
        let movie = {
                posterUrl: data.Poster === "N/A" ? missingImg : data.Poster,
                title: data.Title,
                rating: data.Ratings.length > 0 ? data.Ratings[0].Value.slice(0, 3) : "",
                duration: data.Runtime,
                genre: data.Genre,
                description: data.Plot       
                }

        const movieHtml = getWatchlistMovieHtml(movie)
        watchlistContainer.innerHTML += movieHtml
    }

    // Add event listeners to remove buttons after they have been added to the DOM
    const removeButtons = document.querySelectorAll(".watchlist img");

    removeButtons.forEach((btn, index) => {
        btn.addEventListener("click", function() {
            const movieToRemove = watchlist[index]
            removeFromWatchlist(movieToRemove)
            
            // Optionally, you can refresh the watchlist display after removal
            btn.closest('.card').remove()
        })
    })
})
