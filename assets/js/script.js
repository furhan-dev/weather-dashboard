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
    .catch(error => alert('Unable to connect to Open Weather'));
}

function renderWeather(city, data) {
    const uvi = data.current.uvi;
    const temp = data.current.temp;
    const wind = data.current.wind_speed;
    const humidity = data.current.humidity;
    const icon = data.current.weather[0].icon;

    console.log(city + " " + uvi + " " + temp + " " + wind + " " + humidity + " " + icon);

    const currentWeatherDivEl = document.createElement("div");
    const cls = ["current-weather", "card"];
    currentWeatherDivEl.classList.add(...cls);
    currentWeatherDivEl.textContent = city;
    document.querySelector(".container").append(currentWeatherDivEl);

}

init();