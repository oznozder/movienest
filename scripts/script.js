document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const resultsSection = document.getElementById("results-section");
    const loadMoreButton = document.getElementById("load-more");

    let films = [];
    let displayedFilms = 6;

    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            films = data;
            displayFilms(); // 👈 Başlangıçta sadece bu fonksiyon çağırılır
        })
        .catch(error => console.error("Veri çekme hatası:", error));

    function displayFilms() {
        resultsSection.querySelector(".film-container").innerHTML = "";
        const container = resultsSection.querySelector(".film-container");

        const filmsToShow = films.slice(0, displayedFilms);

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
            displayedFilms = 6;
            displayFilms();
            return;
        }

        const filteredFilms = films.filter(film =>
            film.title.toLowerCase().includes(searchTerm) ||
            film.director.toLowerCase().includes(searchTerm) ||
            film.genre.join(" ").toLowerCase().includes(searchTerm) ||  // genre dizisini birleştiriyoruz
            film.year.toString().includes(searchTerm) // year'ı string'e çeviriyoruz
        );

        resultsSection.querySelector(".film-container").innerHTML = "";
        const container = resultsSection.querySelector(".film-container");

        filteredFilms.forEach(film => {
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

        loadMoreButton.style.display = "none"; // Filtrelemeden sonra "Daha Fazla Göster" butonunu gizle
    }

    function updateLoadMoreButton() {
        if (displayedFilms >= films.length) {
            loadMoreButton.style.display = "none";
        } else {
            loadMoreButton.style.display = "block";
        }
    }

    searchInput.addEventListener("input", searchFilms);

    loadMoreButton.addEventListener("click", function () {
        displayedFilms += 6;
        displayFilms();
    });
});
