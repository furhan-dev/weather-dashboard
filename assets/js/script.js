var placeInputEl = document.querySelector("#place-input");
var placeInputFormEl = document.querySelector("#place-input-form");
var addToDashboardButtonEl = document.querySelector(".add-to-dashboard");
var openWeatherKey = "43c43500c03d466417e4688a5b865e12";

function init() {

    // event listeners
    placeInputEl.addEventListener("input", () => {
        if (placeInputEl.value.length === 0) {
            addToDashboardButtonEl.disabled = true;
            addToDashboardButtonEl.classList.replace("btn-primary", "btn-disabled");
        } else {
            addToDashboardButtonEl.disabled = false;
            addToDashboardButtonEl.classList.replace("btn-disabled", "btn-primary");
        }
    });

    placeInputFormEl.addEventListener("submit", handleWeather);
}

function handleWeather(event) {
    event.preventDefault();
    const city = placeInputEl.value;
    placeInputEl.value = "";
    const geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${openWeatherKey}`;
    fetch(geoCodeUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .then(data => getWeather(data[0].name, data[0].lon, data[0].lat))
    .catch(error => alert('Unable to connect to Open Weather'));
}

function getWeather(city, lon, lat) {
    const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=${openWeatherKey}`;
    fetch(oneCallUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .then(data => renderWeather(city, data))
    // .catch(error => alert('Unable to connect to Open Weather'));
}

function renderWeather(city, data) {
    const currentWeatherObj = {
        "Temp": Math.round(data.current.temp) + "°F",
        "Wind Speed": Math.round(data.current.wind_speed) + " MPH",
        "Humidity": Math.round(data.current.humidity) + "%",
        "UV Index": Math.round(data.current.uvi),
        "icon": data.current.weather[0].icon
    };

    const containterCardEl = document.createElement("div");
    let cls = ["container-card", "card", "my-3"];
    containterCardEl.classList.add(...cls);

    const containerHeaderEl = document.createElement("div");
    cls = ["container-header", "card-header", "h2"];
    containerHeaderEl.classList.add(...cls);
    containerHeaderEl.textContent = city;

    // create container card body div
    const containerBodyEl = document.createElement("div");
    cls = ["container-body", "card-body"];
    containerBodyEl.classList.add(...cls);

    // create current weather card
    const currentWeatherCardEl = document.createElement("div");
    cls = ["current-weather", "card", "col-6", "col-md-4", "col-lg-3"];
    currentWeatherCardEl.classList.add(...cls);

    // create current weather image
    const currentWeatherCardImgEl = document.createElement("img");
    cls = ["current-weather-img", "card-img-top"];
    currentWeatherCardImgEl.classList.add(...cls);
    currentWeatherCardImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + currentWeatherObj["icon"] + "@2x.png");
    currentWeatherCardImgEl.setAttribute("alt", "current weather condition image");

    // create current weather body
    const currentWeatherCardBodyEl = document.createElement("div");
    cls = ["current-weather-body", "card-body"];
    currentWeatherCardBodyEl.classList.add(...cls);

    // create current weather title 
    const currentWeatherCardTitleEl = document.createElement("h5");
    cls = ["current-weather-title", "card-title"];
    currentWeatherCardTitleEl.classList.add(...cls);
    currentWeatherCardTitleEl.textContent = "Current Conditions";

    // create current weather text
    const currentWeatherCardTextEl = document.createElement("div");
    cls = ["current-weather-text", "card-text"];
    currentWeatherCardTextEl.classList.add(...cls);

    // loop over the currentWeatherObj and add to currentWeatherCardTextEl
    for (const property in currentWeatherObj) {

        // skip icon property
        if (property === "icon") {
            break;
        }

        const propertyDiv = document.createElement("div");
        propertyDiv.textContent = `${property}: ${currentWeatherObj[property]}`;
        propertyDiv.classList.add("px-2")

        // // update UVI background color
        if (property === "UV Index") {
            let cls = "";
            const uvi = currentWeatherObj[property];
            if (uvi < 3) {
                cls = "bg-success";
            } else if (uvi < 6) {
                cls = "bg-warning";
            } else {
                cls = "bg-danger";
            }
            propertyDiv.classList.add(cls, "rounded-2");
        }
        currentWeatherCardTextEl.append(propertyDiv);
    }

    // append all the things

    // append current weather elements
    currentWeatherCardBodyEl.append(currentWeatherCardTitleEl, currentWeatherCardTextEl);
    currentWeatherCardEl.append(currentWeatherCardImgEl, currentWeatherCardBodyEl);

    // append current weather to container body
    containerBodyEl.append(currentWeatherCardEl);
    containterCardEl.append(containerHeaderEl, containerBodyEl);
    document.querySelector(".container").append(containterCardEl);

}

init();