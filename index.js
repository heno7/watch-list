const BASE_URL = 'https://www.omdbapi.com/?apikey=3885fdf7&'

const searchBtn = document.querySelector(".search-btn")
const searchForm = document.getElementById('search-form')
const listContainer = document.getElementById('search-result-container')

let searchResult = null

async function handleSearch(e) {
    e.preventDefault()
    const searchKey = document.getElementById('search-key').value
    if (!searchKey) return
    searchResult = await getSearchList(searchKey)
    console.log(searchResult)
    renderSearch(searchResult)
}

async function getSearchList(searchKey) {
    const res = await fetch(`${BASE_URL}s=${searchKey}`)
    const data = await res.json()
    const searchResult = []
    if (data.Response === "False") {
        return searchResult
    }

    for (const record of data.Search) {
        const detail = getDetailRecord(record.imdbID)
        searchResult.push(detail)
    }
    return await Promise.all(searchResult)
}

async function getDetailRecord(imdbID) {
    const res = await fetch(`${BASE_URL}i=${imdbID}`)
    const data = await res.json()
    return data
}

function renderSearch(result) {
    let html = ''
    if (!result || result.length === 0) {
        html = '<p class="no-search-result">Unable to find what you’re looking for. Please try another search.</p>'
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
                <img src="./images/add-watchlist-icon.png" data-imdb-id=${record.imdbID} />
                <span data-imdb-id=${record.imdbID}>Watchlist</span>
              </span>
            </div>
            <p class="firm-description">
              ${record.Plot.length > 100 ? record.Plot.substring(0, 100) + '...' : record.Plot}
            </p>
          </div>
        </div>
    `
}

function handleAddWatchList(imdbId) {
    let watchList = getWatchList()
    if (!watchList) {
        watchList = []
    }
    const hasInWatchList = watchList.find(record => record.imdbID === imdbId)
    if (hasInWatchList) return
    const record = searchResult.find(record => record.imdbID === imdbId)
    if (record) watchList.push(record)
    setWatchList(watchList)
}

function getWatchList() {
    return JSON.parse(localStorage.getItem('watchList'))
}

function setWatchList(list) {
    localStorage.setItem('watchList', JSON.stringify(list))
}

listContainer.addEventListener('click', (e) => {
    const imdbId = e.target.dataset.imdbId
    if (imdbId) handleAddWatchList(imdbId)
})

searchForm.addEventListener('submit', handleSearch)