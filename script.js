async function fetchStore() {
    try {
        const response = await fetch("./datas/store.json");
        const data = await response.json();
        return data.merchandising;
    } catch (err) {
        console.error(err);
        throw err; // Rejeter l'erreur pour la gérer à un niveau supérieur si nécessaire
    }
};

async function fetchTour() {
    try {
        const response = await fetch("./datas/tour.json");
        const data = await response.json();
        return data.concerts;
    } catch (err) {
        console.error(err);
        throw err; // Rejeter l'erreur pour la gérer à un niveau supérieur si nécessaire
    }
};

async function displayStore() {
    const productGrid = document.querySelector(".store-grid");
    try {
        const store = await fetchStore();
        store.forEach((product) => {
            const item = document.createElement("div");
            item.classList.add("item");
            const illustration = document.createElement("img");
            illustration.src = product.photo;
            illustration.classList.add("item-illustration")
            const priceElement = document.createElement("p");
            priceElement.textContent = product.price + "€";
            priceElement.classList.add("item-price");
            const titleElement = document.createElement("h3");
            titleElement.textContent = product.item;
            titleElement.classList.add("item-title");
            item.appendChild(illustration);
            item.appendChild(priceElement);
            item.appendChild(titleElement);
            productGrid.appendChild(item)
        });

    } catch (err) {
        console.error("Une erreur s'est produite lors de la récupération du prix du mug :", err);
    }
}

async function displayTour() {
    const tourWrapper = document.querySelector(".tour-wrapper");

    try {
        const dates = await fetchTour();
        dates.sort((a, b) => new Date(a.date) - new Date(b.date));
        dates.forEach((tourDate) => {
            const concert = createConcertElement(tourDate);
            tourWrapper.appendChild(concert);
        });
    } catch (err) {
        console.error(err);
    }
}

function createConcertElement(tourDate) {
    const concert = document.createElement("div");
    const date = createDateElement(tourDate.date);
    const city = createDivElement("city", tourDate.city);
    const venue = createDivElement("venue", tourDate.venue);

    concert.classList.add("concert");
    concert.appendChild(date);
    concert.appendChild(venue);
    concert.appendChild(city);

    return concert;
}

function createDateElement(dateString) {
    const dateObj = new Date(dateString);
    const dayOfWeek = dateObj.toLocaleString("en", { weekday: "short" });
    const month = dateObj.toLocaleString("en", { month: "short" });
    let dayOfMonth = dateObj.getDate();
    if (dayOfMonth < 10) {
        dayOfMonth = `0${dayOfMonth}`;
    }
    const year = dateObj.getFullYear().toString().slice(-2);
    const formattedDate = `${dayOfWeek}, ${month.toUpperCase()} ${dayOfMonth}, ${year}`;
    const dateElement = createDivElement("date", formattedDate);
    return dateElement;
}

function createDivElement(className, textContent) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.textContent = textContent;
    return div;
}

displayStore();
displayTour();
