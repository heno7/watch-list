
function renderSearch(result) {
    let html = ''
    if (!result || result.length === 0) {
        html = `
            <div class="empty-watch-list">
                <p class="empty-watch-list-message">
                    Your watchlist is looking a little empty...
                </p>
                <div
                    class="empty-watch-list-add"
                    onclick="window.location.href = '/index.html'"
                >
                    <img src="./images/add-watchlist-icon.png" />
                    Let’s add some movies!
                </div>
            </div>
        `
    } else {
        for (const record of result) {
            if (record.Poster === 'N/A') continue
            html += createSearchResultItem(record)
        }
    }
    listContainer.innerHTML = html
}

function createSearchResultItem(record) {
    return `
        <div class="firm-card">
          <img
            src="${record.Poster}"
            alt="firm image"
            class="firm-image"
          />
          <div class="frim-info">
            <div class="firm-info-header">
              <h3 class="firm-name">${record.Title}</h3>
              <p>⭐ <span class="firm-rate">${record.imdbRating}</span></p>
            </div>
            <div class="firm-info-body">
              <span class="firm-duration">${record.Runtime}</span>
              <span class="firm-category">${record.Genre}</span>
              <span class="add-watchlist" data-imdb-id=${record.imdbID}>
                <img src="./images/remove-watchlist-icon.png" data-imdb-id=${record.imdbID} />
                <span data-imdb-id=${record.imdbID}>Remove</span>
              </span>
            </div>
            <p class="firm-description">
              ${record.Plot.length > 100 ? record.Plot.substring(0, 100) + '...' : record.Plot}
            </p>
          </div>
        </div>
    `
}

function getWatchList() {
    return JSON.parse(localStorage.getItem('watchList'))
}

function setWatchList(list) {
    localStorage.setItem('watchList', JSON.stringify(list))
}

function handleRemoveWatchList(imdbId) {
    const watchList = getWatchList()
    const indexOfRecord = watchList.findIndex(record => record.imdbID === imdbId)
    watchList.splice(indexOfRecord, 1)
    setWatchList(watchList)
    renderSearch(watchList)
}


let listContainer = null

window.addEventListener('load', () => {
    listContainer = document.getElementById('search-result-container')
    const watchList = getWatchList()
    renderSearch(watchList)


    listContainer.addEventListener('click', (e) => {
        const imdbId = e.target.dataset.imdbId
        if (imdbId) {
            handleRemoveWatchList(imdbId)
        }
    })
})