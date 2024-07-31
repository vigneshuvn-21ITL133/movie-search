document.addEventListener('DOMContentLoaded', function () {

    const apiKey = 'ea9373655d991a39fb3bf8119ffc6999';
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const moviesContainer = document.getElementById('movies');
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; 
    const trailerModal = document.getElementById('trailerModal');
    const trailerIframe = document.getElementById('trailer');
    const closeModal = document.getElementById('closeModal');

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim();
        if (query) {
            searchMovies(query);
        }
    });

    function searchMovies(query) {
        const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                moviesContainer.innerHTML = ''; 
                data.results.forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie');
                    movieElement.dataset.movieId = movie.id;
                    const posterPath = movie.poster_path ? `${imageBaseUrl}${movie.poster_path}` : 'https://via.placeholder.com/150'; // Fallback image if no poster

                    movieElement.innerHTML = `
                        <img src="${posterPath}" alt="${movie.title} Poster">
                        <div>
                            <h2>${movie.title}</h2>
                            <p>Release Date: ${movie.release_date}</p>
                            <p>Rating: ${movie.vote_average}</p>
                            <p>${movie.overview}</p>
                        </div>
                    `;
                    movieElement.addEventListener('click', () => showTrailer(movie.id));
                    moviesContainer.appendChild(movieElement);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function showTrailer(movieId) {
        const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                if (trailer) {
                    trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}`;
                    trailerModal.style.display = 'flex';
                } else {
                    alert('Trailer not available');
                }
            })
            .catch(error => console.error('Error fetching trailer:', error));
    }

    closeModal.addEventListener('click', () => {
        trailerModal.style.display = 'none';
        trailerIframe.src = '';
    });

    window.addEventListener('click', (event) => {
        if (event.target === trailerModal) {
            trailerModal.style.display = 'none';
            trailerIframe.src = '';
        }
    });
});
