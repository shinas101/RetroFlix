let tmdbData = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const type = urlParams.get('type');

    loadDetails(id, type);

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    window.addEventListener('scroll', () => {
        const downloadsContainer = document.querySelector('.downloads-container');
        if (isElementInViewport(downloadsContainer) && !downloadsContainer.dataset.loaded) {
            if (tmdbData) {
                loadDownloads(tmdbData.title || tmdbData.name);
                downloadsContainer.dataset.loaded = 'true';
            }
        }
    });
});

async function loadDetails(id, type) {
    const API_KEY = 'ec5e6c3df989f7d2c96d3103cfa8d8bd';
    try {
        const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`
        );
        const details = await detailsResponse.json();
        
        const creditsResponse = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${API_KEY}`
        );
        const credits = await creditsResponse.json();
        
        const similarResponse = await fetch(
            `https://api.themoviedb.org/3/${type}/${id}/similar?api_key=${API_KEY}`
        );
        const similar = await similarResponse.json();
        
        tmdbData = details;
        updateDetailsUI(details, credits, similar);
    } catch (error) {
        console.error('Error loading details:', error);
        showError();
    }
}

async function loadDownloads(title) {
    try {
        const downloadsGrid = document.querySelector('.downloads-grid');
        downloadsGrid.innerHTML = '<div class="downloads-loading">LOADING DOWNLOADS...</div>';

        const response = await fetch(`https://retroflix.yellowflash-cloud7775.workers.dev/api/search?q=${encodeURIComponent(title)}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();

        updateDownloadsUI(data.results);
    } catch (error) {
        console.error('Error loading downloads:', error);
        showDownloadsError();
    }
}

function updateDownloadsUI(downloads) {
    const downloadsGrid = document.querySelector('.downloads-grid');
    
    if (!downloads || downloads.length === 0) {
        downloadsGrid.innerHTML = '<div class="no-downloads">No download links available</div>';
        return;
    }

    downloadsGrid.innerHTML = downloads.map(item => `
        <div class="download-item">
            <div class="download-info">
                <span class="download-title">${item.title}</span>
                <span class="download-size">${item.size}</span>
                <span class="download-type">${item.linktype}</span>
            </div>
            <a href="${item.link}" class="download-button" target="_blank">
                DOWNLOAD
            </a>
        </div>
    `).join('');
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function updateDetailsUI(tmdbData, creditsData, similarData) {
    const detailsContent = document.querySelector('.details-content');
    
    detailsContent.innerHTML = `
        <div class="details-grid">
            <div class="poster-container">
                <img src="https://image.tmdb.org/t/p/w500${tmdbData.poster_path}" 
                     alt="${tmdbData.title || tmdbData.name}"
                     class="details-poster">
            </div>
            <div class="info-container">
                <h2 class="details-title">${tmdbData.title || tmdbData.name}</h2>
                
                <div class="details-meta">
                    <span class="year">${(tmdbData.release_date || tmdbData.first_air_date || '').slice(0,4)}</span>
                    <span class="runtime">${tmdbData.runtime || tmdbData.episode_run_time?.[0] || '?'} min</span>
                    <span class="rating">⭐ ${tmdbData.vote_average.toFixed(1)}</span>
                </div>

                <div class="genres">
                    ${tmdbData.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                </div>

                <div class="overview">
                    <h3>OVERVIEW</h3>
                    <p>${tmdbData.overview}</p>
                </div>

                <div class="cast">
                    <h3>CAST</h3>
                    <div class="cast-grid">
                        ${creditsData.cast.slice(0, 6).map(actor => `
                            <div class="cast-item">
                                <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" 
                                     alt="${actor.name}"
                                     onerror="this.src='images/default-avatar.jpg'">
                                <span class="actor-name">${actor.name}</span>
                                <span class="character-name">${actor.character}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function showError() {
    const detailsContent = document.querySelector('.details-content');
    detailsContent.innerHTML = `
        <div class="error-message">
            <h2>ERROR LOADING CONTENT</h2>
            <p>Please try again later</p>
            <a href="index.html" class="back-btn">GO BACK</a>
        </div>
    `;
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
} 