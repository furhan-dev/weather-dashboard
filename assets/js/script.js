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
    const containterCardEl = document.createElement("div");
    let cls = ["container-card", "card", "border-0", "my-3"];
    containterCardEl.classList.add(...cls);

    const containerHeaderEl = document.createElement("div");
    cls = ["container-header", "card-header", "rounded-3", "shadow-sm", "h2"];
    containerHeaderEl.classList.add(...cls);
    containerHeaderEl.textContent = city;

    // create container card body div
    const containerBodyEl = document.createElement("div");
    cls = ["container-body", "card-body", "row"];
    containerBodyEl.classList.add(...cls);

    // get current weather data and store in object
    const currentWeatherObj = {
        "Temp": Math.round(data.current.temp) + "°F",
        "Wind Speed": Math.round(data.current.wind_speed) + " MPH",
        "Humidity": Math.round(data.current.humidity) + "%",
        "UV Index": Math.round(data.current.uvi),
        "icon": data.current.weather[0].icon
    };

    // append current weather to container body
    containerBodyEl.append(createDailyWeatherCard(null, currentWeatherObj));

    const dailyDataArray = data.daily;
    for (let i = 0; i < 5; i++) {
        const data = dailyDataArray[i];
        const weatherDataObj = {
            "Temp": data.temp.max + "°F",
            "Wind Speed": Math.round(data.wind_speed) + " MPH",
            "Humidity": Math.round(data.humidity) + "%",
            "UV Index": Math.round(data.uvi),
            "icon": data.weather[0].icon
        }

        // append daily weather to container body
        containerBodyEl.append(createDailyWeatherCard(moment.unix(data.dt).format("MM/DD/YYYY"), weatherDataObj));

    }

    // append everything to body
    containterCardEl.append(containerHeaderEl, containerBodyEl);
    document.querySelector(".container").append(containterCardEl);

}

function createDailyWeatherCard(date, weatherDataObj) {
    // create weather card
    const weatherCardContainerEl = document.createElement("div");
    cls = ["weather-card-container", "p-0", "col-6", "col-md-4", "col-lg-3"];
    weatherCardContainerEl.classList.add(...cls);

    // create weather card
    const weatherCardEl = document.createElement("div");
    cls = ["weather-card", "card", "rounded-3", "shadow", "border-0", "m-1"];
    weatherCardEl.classList.add(...cls);

    // create weather image
    const weatherCardImgEl = document.createElement("img");
    cls = ["weather-img", "card-img-top"];
    weatherCardImgEl.classList.add(...cls);
    weatherCardImgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherDataObj["icon"] + "@4x.png");
    weatherCardImgEl.setAttribute("alt", "weather condition image");

    // create weather body
    const weatherCardBodyEl = document.createElement("div");
    cls = ["weather-body", "card-body"];
    weatherCardBodyEl.classList.add(...cls);

    // create weather title 
    const weatherCardTitleEl = document.createElement("h5");
    cls = ["weather-title", "card-title", "text-center"];
    weatherCardTitleEl.classList.add(...cls);
    if (date != null) {
        weatherCardTitleEl.textContent = date;

    } else {
        weatherCardTitleEl.textContent = "Current Conditions";
    }

    // create weather text
    const weatherCardTextEl = document.createElement("div");
    cls = ["weather-text", "card-text"];
    weatherCardTextEl.classList.add(...cls);

    // loop over the weatherDataObj and add to weatherCartTextEl
    for (const property in weatherDataObj) {

        // skip icon property
        if (property === "icon") {
            break;
        }

        const propertyDiv = document.createElement("div");
        propertyDiv.textContent = `${property}: ${weatherDataObj[property]}`;
        propertyDiv.classList.add("px-2")

        // // update UVI background color
        if (property === "UV Index") {
            let cls = "";
            const uvi = weatherDataObj[property];
            if (uvi < 3) {
                cls = "bg-success";
            } else if (uvi < 6) {
                cls = "bg-warning";
            } else {
                cls = "bg-danger";
            }
            propertyDiv.classList.add(cls, "rounded-2");
        }
        weatherCardTextEl.append(propertyDiv);
    }

    // append weather elements to card
    weatherCardBodyEl.append(weatherCardTitleEl, weatherCardTextEl);
    weatherCardEl.append(weatherCardImgEl, weatherCardBodyEl);
    weatherCardContainerEl.append(weatherCardEl);
    return weatherCardContainerEl;
}

init();