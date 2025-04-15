document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const resultsSection = document.getElementById("results-section");
    const loadMoreButton = document.getElementById("load-more");
    const noResultsDiv = document.getElementById("no-results"); // 🎯 no-results div’ine erişiyoruz

    let films = [];
    let displayedFilms = 6;
    let allFilmsFiltered = [];

    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            films = data;
            allFilmsFiltered = [...films]; 
            displayFilms(); 
        })
        .catch(error => console.error("Veri çekme hatası:", error));

    function displayFilms() {
        const container = resultsSection.querySelector(".film-container");
        container.innerHTML = "";

        const filmsToShow = allFilmsFiltered.slice(0, displayedFilms);

        filmsToShow.forEach(film => {
            const filmCard = document.createElement("div");
            filmCard.classList.add("film-card");
            filmCard.innerHTML = `
                <img src="${film.poster}" alt="${film.title}">
                <h3>${film.title}</h3>
                <p>Yönetmen: ${film.director}</p>
                <p>Yıl: ${film.year}</p>
            `;
            filmCard.addEventListener("click", () => showPopup(film));
            container.appendChild(filmCard);
        });

        updateLoadMoreButton();
    }

    function searchFilms() {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm === "") {
            allFilmsFiltered = [...films]; 
            displayedFilms = 6;
            noResultsDiv.style.display = "none"; // Arama kutusu boşsa no-result gizle
            displayFilms();
            return;
        }

        allFilmsFiltered = films.filter(film =>
            film.title.toLowerCase().includes(searchTerm) ||
            film.director.toLowerCase().includes(searchTerm) ||
            film.genre.join(" ").toLowerCase().includes(searchTerm) ||
            film.year.toString().includes(searchTerm)
        );

        const container = resultsSection.querySelector(".film-container");
        container.innerHTML = "";

        // 🎯 Hiç sonuç bulunamazsa no-results div’ini göster
        if (allFilmsFiltered.length === 0) {
            noResultsDiv.style.display = "flex";
            loadMoreButton.style.display = "none";
        } else {
            noResultsDiv.style.display = "none";
            displayedFilms = 6;
            displayFilms();
        }
    }

    function updateLoadMoreButton() {
        if (displayedFilms >= allFilmsFiltered.length) {
            loadMoreButton.style.display = "none";
        } else {
            loadMoreButton.style.display = "block";
        }
    }

    function loadMoreFilms() {
        displayedFilms += 6;
        displayFilms();
    }

    // Debounce fonksiyonu
    const debouncedSearch = debounce(searchFilms, 500); 

    searchInput.addEventListener("input", debouncedSearch);
    loadMoreButton.addEventListener("click", loadMoreFilms);
});

// Debounce fonksiyonu
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}
