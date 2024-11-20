document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // Load content
    loadTrendingMovies();
    loadPopularTVShows();

    // Initialize sliders
    initializeSliders();
});

function initializeSliders() {
    const movieSlider = document.getElementById('movieSlider');
    const tvSlider = document.getElementById('tvSlider');

    // Initialize both sliders
    initializeDraggableSlider(movieSlider);
    initializeDraggableSlider(tvSlider);

    // Setup button controls for both sliders
    setupSliderButtons(movieSlider);
    setupSliderButtons(tvSlider);
}

function initializeDraggableSlider(slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        
        // Prevent default drag behavior
        e.preventDefault();
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        slider.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor style
    slider.style.cursor = 'grab';
}

function setupSliderButtons(slider) {
    const prevBtn = slider.parentElement.querySelector('.prev-btn');
    const nextBtn = slider.parentElement.querySelector('.next-btn');
    const scrollAmount = 400;

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

async function loadTrendingMovies() {
    try {
        const response = await fetch('http://localhost:5000/api/trending/movies');
        const data = await response.json();
        updateMovieSlider(data.results);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

async function loadPopularTVShows() {
    try {
        const response = await fetch('http://localhost:5000/api/tv/popular');
        const data = await response.json();
        updateTVSlider(data.results);
    } catch (error) {
        console.error('Error loading TV shows:', error);
    }
}

function updateMovieSlider(movies) {
    const movieSlider = document.getElementById('movieSlider');
    movieSlider.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="location.href='details.html?id=${movie.id}&type=movie'">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                 alt="${movie.title}"
                 class="movie-poster">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>⭐ ${movie.vote_average.toFixed(1)}</p>
            </div>
        </div>
    `).join('');
}

function updateTVSlider(shows) {
    const tvSlider = document.getElementById('tvSlider');
    tvSlider.innerHTML = shows.map(show => `
        <div class="movie-card" onclick="location.href='details.html?id=${show.id}&type=tv'">
            <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" 
                 alt="${show.name}"
                 class="movie-poster">
            <div class="movie-info">
                <h3>${show.name}</h3>
                <p>⭐ ${show.vote_average.toFixed(1)}</p>
            </div>
        </div>
    `).join('');
}

// Theme functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
} 