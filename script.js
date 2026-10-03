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
