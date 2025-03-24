document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const resultsSection = document.getElementById("results-section");
    const loadMoreButton = document.getElementById("load-more"); // 📌 Butonu seçtik

    let films = [];
    let displayedFilms = 6; // İlk başta 3 film gösterilecek

    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            films = data;
            displayFilms(films.slice(0, displayedFilms)); // İlk 3 filmi göster
        })
        .catch(error => console.error("Veri çekme hatası:", error));

    function displayFilms(filteredFilms) {
        resultsSection.innerHTML = "";
        const container = document.createElement("div");
        container.classList.add("film-container");

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

        resultsSection.appendChild(container);

        // 📌 Eğer filtrelenmiş film sayısı, toplam film sayısından küçükse butonu gizle
        updateLoadMoreButton(filteredFilms.length);
    }

    function searchFilms() {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm === "") {
            // 🔹 Arama kutusu boşsa tüm filmleri göster ve butonu geri getir
            displayedFilms = 3;
            displayFilms(films.slice(0, displayedFilms));
            loadMoreButton.style.display = "block"; // Butonu geri getir
            return;
        }

        const filteredFilms = films.filter(film =>
            film.title.toLowerCase().includes(searchTerm) ||
            film.director.toLowerCase().includes(searchTerm) ||
            film.genre.toLowerCase().includes(searchTerm)
        );

        displayFilms(filteredFilms);
    }

    function updateLoadMoreButton(filteredCount) {
        if (filteredCount < films.length) {
            loadMoreButton.style.display = "none"; // 📌 Filtrelenmiş film sayısı azsa butonu gizle
        } else {
            loadMoreButton.style.display = "block"; // 📌 Tüm filmler varsa butonu göster
        }
    }

    // 🔹 Arama kutusuna her harf girildiğinde (veya silindiğinde) çalıştır
    searchInput.addEventListener("input", searchFilms);

    // 🔹 Daha Fazla Göster Butonu
    loadMoreButton.addEventListener("click", function () {
        displayedFilms += 3; // 📌 3 film daha ekle
        displayFilms(films.slice(0, displayedFilms));
    });
});
