async function displayStore(data) {
    const productGrid = document.querySelector(".store-grid");
    try {
        data.forEach((product) => {
            const item = createProductElement(product);
            productGrid.appendChild(item);
        });
    } catch (err) {
        console.error("Une erreur s'est produite lors de l'affichage du store", err);
    }
}

function createProductElement(product) {
    const item = document.createElement("div");
    item.classList.add("item");
    const illustration = document.createElement("img");
    illustration.src = product.photo;
    illustration.classList.add("item-illustration");
    const priceElement = document.createElement("p");
    priceElement.textContent = product.price + "€";
    priceElement.classList.add("item-price");
    const titleElement = document.createElement("h3");
    titleElement.textContent = product.item;
    titleElement.classList.add("item-title");
    item.appendChild(illustration);
    item.appendChild(priceElement);
    item.appendChild(titleElement);
    return item;
}

async function displayFilterBtns(data) {
    const filterBtns = document.querySelector(".filter-btns");

    let store = [...data];
    let storeType = store.map((product) => product.type);
    storeType = Array.from(new Set(storeType));

    const allBtn = createFilterButton("All", true);
    filterBtns.appendChild(allBtn);
    allBtn.addEventListener("click", async () => {
        // Mettre à jour la classe active des boutons de filtre
        const activeBtn = document.querySelector(".filter-btn.active");
        if (activeBtn) {
            activeBtn.classList.remove("active");
        }
        allBtn.classList.add("active");
        // Afficher tous les éléments
        await updateDisplayedStore(data);
    });

    storeType.forEach((type) => {
        const filterBtn = createFilterButton(type);
        filterBtns.appendChild(filterBtn);
        filterBtn.addEventListener("click", async () => {
            const activeBtn = document.querySelector(".filter-btn.active");
            if (activeBtn) {
                activeBtn.classList.remove("active");
            }
            filterBtn.classList.add("active");
            // Filtrer les éléments en fonction du type de filtre
            const filteredStore = data.filter(el => el.type === type);
            await updateDisplayedStore(filteredStore);
        });
    });
}


function createFilterButton(text, isActive = false) {
    const filterBtn = document.createElement("button");
    filterBtn.textContent = text;
    filterBtn.classList.add("filter-btn");
    if (isActive) {
        filterBtn.classList.add("active");
    }
    return filterBtn;
}

async function updateDisplayedStore(data) {
    const productGrid = document.querySelector(".store-grid");
    productGrid.innerHTML = ""; // Clear existing items
    await displayStore(data);
}

async function filterStore(e, data) {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const target = e.target;
    if (target.classList.contains("active")) {
        return;
    }
    filterBtns.forEach((btn) => {
        btn.classList.remove("active");
    });

    target.classList.add("active");
    const filteredStore = data.filter(el => el.type === target.textContent.toLowerCase());
    await updateDisplayedStore(filteredStore);
}

async function fetchStore() {
    try {
        const response = await fetch("./datas/store.json");
        const data = await response.json();
        return data.merchandising;
    } catch (err) {
        console.error(err);
        throw err; // Rejeter l'erreur pour la gérer à un niveau supérieur si nécessaire
    }
}

async function displayTour() {
    const tourWrapper = document.querySelector(".tour-wrapper");

    try {
        const response = await fetch("./datas/tour.json");
        const data = await response.json();
        const dates = data.concerts;
        dates.sort((a, b) => new Date(a.date) - new Date(b.date));

        dates.forEach((tourDate) => {
            const concert = document.createElement("div");
            concert.classList.add("concert");

            const date = document.createElement("div");
            date.classList.add("date");
            date.textContent = formatTourDate(tourDate.date);

            const venue = document.createElement("div");
            venue.classList.add("venue");
            venue.textContent = tourDate.venue;

            const city = document.createElement("div");
            city.classList.add("city");
            city.textContent = tourDate.city;

            concert.appendChild(date);
            concert.appendChild(venue);
            concert.appendChild(city);

            tourWrapper.appendChild(concert);
        });
    } catch (err) {
        console.error(err);
    }
}

function formatTourDate(dateString) {
    const dateObj = new Date(dateString);
    const dayOfWeek = dateObj.toLocaleString("en", { weekday: "short" });
    const month = dateObj.toLocaleString("en", { month: "short" });
    let dayOfMonth = dateObj.getDate();
    if (dayOfMonth < 10) {
        dayOfMonth = `0${dayOfMonth}`;
    }
    const year = dateObj.getFullYear().toString().slice(-2);
    return `${dayOfWeek}, ${month.toUpperCase()} ${dayOfMonth}, ${year}`;
}

// Appels initiaux
(async function () {
    const storeData = await fetchStore();
    displayStore(storeData);
    displayFilterBtns(storeData);
    displayTour();
    window.addEventListener("scroll", reveal);
})();

function reveal() {
    const reveals = document.querySelectorAll(".reveal");

    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let revealTop = reveals[i].getBoundingClientRect().top;
        let revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveals[i].classList.add('active');
        }
    }
}
