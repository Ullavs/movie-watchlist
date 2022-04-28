const API_KEY = "2a7ca420";
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie`;
const searchBar = document.getElementById("search-bar");
const searchInput = document.getElementById("search");
const movieList = document.getElementById("movie-list");
const startExploring = document.getElementById("start-exploring");
const unableToFind = document.getElementById("unable");
const emptyWatchlist = document.getElementById("empty-watchlist");

if (searchBar) {
  searchBar.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value;

    fetch(`${API_URL}&s=${searchTerm}`)
      .then((res) => {
        if (!res.ok) {
          throw Error("Search is unavailable");
        }
        return res.json();
      })

      .then((data) => data.Search.map((movieResult) => movieResult.imdbID))

      .then((movieIDs) => fetchMovies(movieIDs))
      .then((movies) => showMovies(movies))
      .catch((err) => showNoResults());
  });
}

const fetchMovies = (movieIDs) => {
  return Promise.all(
    movieIDs.map((movieID) => {
      return fetch(`${API_URL}&i=${movieID}`);
    })
  ).then((responses) =>
    Promise.all(responses.map((response) => response.json()))
  );
};

const showMovies = (movies) => {
  const IDsList = JSON.parse(window.localStorage.getItem("IDsList") || "[]");
  const moviesHtml = movies.map((movie) => {
    const poster = movie.Poster;
    const title = movie.Title;
    const rating = movie.imdbRating;
    const duration = movie.Runtime;
    const genre = movie.Genre;
    const summary =
      movie.Plot === "N/A" || movie.Plot.slice(-1) === "."
        ? movie.Plot
        : `${movie.Plot.trim()}...`;
    const movieID = movie.imdbID;
    const onWatchlist = IDsList.includes(movieID);
    return `
      <div class="movie-result">
        <a class="movie-poster" href="https://www.imdb.com/title/${movieID}/"> 
        <img
          src="${poster === "N/A" ? "default-movie-poster.jpg" : poster}"
          alt="movie poster"
          width="300"
          height="447"
        />
        </a> 
        <div class="title-rating">
          <h3 class="movie-title"><a href="https://www.imdb.com/title/${movieID}/">${title}</a></h3>
          <span class="movie-rating"
            ><img
              class="rating-icon"
              src="star-icon.svg"
              width="15"
              height="15"
              alt="rating icon"
            /> ${rating}</span
          >
        </div>
        <div class="movie-details">
          <span class="movie-duration">${duration}</span>
          <span class="movie-genre">${genre}</span>
          <button class="${
            !onWatchlist ? "add-watchlist" : "remove-watchlist"
          }" data-id="${movieID}">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="plus-icon"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z"
              />
            </svg>
            <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="remove-icon"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9H11C11.5523 9 12 8.55229 12 8C12 7.44772 11.5523 7 11 7H5Z"
                />
              </svg>
            Watchlist
          </button>
        </div>
        <p class="movie-summary">
          ${summary}
        </p>
      </div>
    `;
  });

  movieList.innerHTML = moviesHtml.join("");
  if (startExploring) {
    startExploring.style.display = "none";
  }

  if (unableToFind) {
    unableToFind.style.display = "none";
  }
  movieList.style.display = "block";
};

const showNoResults = () => {
  movieList.style.display = "none";
  startExploring.style.display = "none";
  unableToFind.style.display = "grid";
};

movieList.addEventListener("click", (event) => {
  const target = event.target.closest(".add-watchlist");

  if (target && target.classList.contains("add-watchlist")) {
    addToLocalStorage(target);
    event.stopImmediatePropagation();
  }
});

const addToLocalStorage = (target) => {
  const ID = target.dataset.id;
  const IDsList = JSON.parse(window.localStorage.getItem("IDsList") || "[]");

  if (!IDsList.includes(ID)) {
    IDsList.push(ID);
    window.localStorage.setItem("IDsList", JSON.stringify(IDsList));
  }

  target.classList.toggle("add-watchlist");
  target.classList.toggle("remove-watchlist");
};

movieList.addEventListener("click", (event) => {
  const target = event.target.closest(".remove-watchlist");

  if (target && target.classList.contains("remove-watchlist")) {
    removeFromLocalStorage(target);

    if (movieList.classList.contains("movie-watchlist")) {
      target.closest(".movie-result").remove();
      if (!movieList.children.length) {
        emptyWatchlist.style.display = "grid";
      }
    }

    event.stopImmediatePropagation();
  }
});

const removeFromLocalStorage = (target) => {
  const ID = target.dataset.id;
  const IDsList = JSON.parse(window.localStorage.getItem("IDsList") || "[]");

  if (IDsList.includes(ID)) {
    const newIDsList = IDsList.filter((item) => {
      return item !== ID;
    });
    window.localStorage.setItem("IDsList", JSON.stringify(newIDsList));
  }

  target.classList.toggle("add-watchlist");
  target.classList.toggle("remove-watchlist");
};

const showWatchlist = async () => {
  if (!movieList.classList.contains("movie-watchlist")) {
    return;
  }

  const IDsList = JSON.parse(window.localStorage.getItem("IDsList") || "[]");

  if (!IDsList.length) {
    return;
  }
  emptyWatchlist.style.display = "none";
  const moviesWatchlist = await fetchMovies(IDsList);
  showMovies(moviesWatchlist);
};

showWatchlist();
