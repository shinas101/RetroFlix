document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.querySelector('.search-results');
    let timeoutId;

    
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    
    searchButton.addEventListener('click', () => {
        if (searchInput.value.trim().length > 2) {
            searchMovies(searchInput.value.trim());
        }
    });

    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim().length > 2) {
            searchMovies(searchInput.value.trim());
        }
    });

    
    searchInput.addEventListener('input', () => {
        clearTimeout(timeoutId);
        if (searchInput.value.trim().length > 2) {
            timeoutId = setTimeout(() => {
                searchMovies(searchInput.value.trim());
            }, 500);
        } else {
            searchResults.innerHTML = '';
        }
    });
});

async function searchMovies(query) {
    const searchResults = document.querySelector('.search-results');
    searchResults.innerHTML = '<div class="loading">SEARCHING...</div>';

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=ec5e6c3df989f7d2c96d3103cfa8d8bd&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        
        if (data.results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">NO RESULTS FOUND</div>';
            return;
        }

        const filteredResults = data.results.filter(item => 
            (item.media_type === 'movie' || item.media_type === 'tv') && 
            item.poster_path
        );

        searchResults.innerHTML = filteredResults.map(item => `
            <div class="search-item" onclick="location.href='details.html?id=${item.id}&type=${item.media_type}'">
                <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" 
                     alt="${item.title || item.name}"
                     class="search-poster">
                <div class="search-info">
                    <h3>${item.title || item.name}</h3>
                    <p>${item.media_type.toUpperCase()} • ${(item.release_date || item.first_air_date || '').slice(0,4)}</p>
                    <p class="rating">⭐ ${item.vote_average.toFixed(1)}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error searching:', error);
        searchResults.innerHTML = '<div class="error">SEARCH ERROR. PLEASE TRY AGAIN.</div>';
    }
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