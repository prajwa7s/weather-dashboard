const API_KEY = "";

//DOM elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const forecastList = document.getElementById("forecastList");
const loading = document.getElementById("loading");
const errorMsg = document.getElementById("errorMsg");
const favoritesList = document.getElementById("favoritesList");
const themeBtn = document.getAnimations("themeBtn");

//Get current weather
async function getWeather(city){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if(!response.ok){
        throw new Error("City not found");

    }
    const data = await response.json();
    return{
        city: data.name,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed
    };
}

//Get 5 Day Forecast
async function getForecast(city){
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    if(!response.ok){
        throw new Error("Forecast not found");
    }
    const data = await response.json();
    return data.list;
}

// Search weather
async function searchWeather(city){
    if(!city){
        showError("Please enter a city name.");
        return;
    }
    loading.style.display = "block";
    weatherCard.style.display = "none";
    errorMsg.style.display = "none";

    try{
        const weather = await getWeather(city);
        const forecast = await getForecast(city);

        displayWeather(weather);
        displayForecast(forecast);

    }
    catch(error){
        showError(error.message);
    }
    finally{
        loading.style.display = "none";
    }
}
