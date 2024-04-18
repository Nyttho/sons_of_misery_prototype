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
            const concert = document.createElement("div");
            const dateObj = new Date(tourDate.date);

            // Récupère le jour de la semaine
            const dayOfWeek = dateObj.toLocaleString("en", { weekday: "short" });

            // Récupère le mois
            const month = dateObj.toLocaleString("en", { month: "short" });

            // Récupère le jour du mois
            const dayOfMonth = dateObj.getDate();

            // Crée la chaîne de date au format "Thu, APR 25"
            const formattedDate = `${dayOfWeek}, ${month.toUpperCase()} ${dayOfMonth}`;
            concert.classList.add("concert");
            const date = document.createElement("div");
            date.classList.add("date");
            date.textContent = formattedDate;
            const city = document.createElement("div");
            city.classList.add("city");
            city.textContent = tourDate.city;
            const venue = document.createElement("div");
            venue.classList.add("venue");
            venue.textContent = tourDate.venue;

            concert.appendChild(date);
            concert.appendChild(venue);
            concert.appendChild(city);

            tourWrapper.appendChild(concert);
        })
    } catch (err) {
        console.error(err);
    }
}

displayStore();
displayTour();
