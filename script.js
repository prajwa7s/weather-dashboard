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

//Display current weather
function displayWeather(weather){
    weatherCard.innerHTML = `

        <h2>${weather.city}</h2>

        <div class="temperature">
            ${weather.temp}°C
        </div>

        <p>${weather.description}</p>

        <div class="weather-info">

            <div class="info-box">
                Feels Like: ${weather.feelsLike}°C
            </div>

            <div class="info-box">
                Humidity: ${weather.humidity}%
            </div>

            <div class="info-box">
                Wind: ${weather.windSpeed} m/s
            </div>

        </div>

        <button 
            class="favorite-btn" 
            onclick="addFavorite('${weather.city}')">
            ⭐ Add to Favorites
        </button>
        
        `;
        weatherCard.style.display = "block";
}
//Display 5 Day Forecast
function displayForecast(forecast){
    forecastList.innerHTML = "";
    const days = {};
     
    forecast.forEach(item => {
        const date = item.dt_txt.split(" ")[0];

        if(!days[date]){
            days[date] = item;

        }
    });
    const dates = Object.keys(days).slice(0,5);
    dates.forEach(date => {
        const item = days[date];
        const card = document.createElement("div");
        card.className ="forecast-card";

        card.innerHTML = `
            <h3>${date}</h3>

                <img
                    src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png"
                    alt="weather icon"
                >

                <p>
                    ${Math.round(item.main.temp)}°C
                </p>

                <p>
                    ${item.weather[0].description}
                </p>
        `;
        forecastList.appendChild(card);
    });
}
//Load favorites
function loadFavorites(){
    let favorites = 
        JSON.parse(parse(localStorage.getItem("favorites")) || []);

    favoritesList.innerHTML = "";
    if(favorites.length === 0){
        favoritesList.innerHTML = 
            "<p>No favorite cities yet.</p>";
        return;
    }
    favorites.forEach(city => {
        const div = document.createElement("div");
        div.className = "favorite-item";
        div.innerHTML = `
            <span>${city}</span>
            <div>
                <button onclick="searchWeather('${city}')">Search</button>

                <button class="remove-btn" onclick="removeFavorite"('${city}')">Remove</button>

            </div>
                    
        `;
        favoritesList.appendChild(div);
    });
}

//Remove favorite
function removeFavorite(city){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites = favorites.filter(
        favorite => favorite !== city
    );
    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    loadFavorites();

}
//Show error
function showError(message){
    errorMsg.textContent = message;
    errorMsg.style.display = "block";

}
//Debounce
let timer;
function debounceSearch(){
    clearTimeout(timer);

    timer = setTimeout(() => {
        const city = cityInput.ariaValueMax.trim();
        searchWeather(city);
    },500);
}
//Theme toggle
themeBtn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");


    if(document.body.classList.contains("dark")){
        themeBtn.textContent = "☀️ Light";

    }else{
        themeBtn.textContent = "🌙 Dark";
    }
})
//Search button
searchBtn.addEventListener("click", ()=>{
    const city = cityInput.value.trim();
    searchWeather(city);
});
//Debounce input search
cityInput.addEventListener("input",debounceSearch);

//Enter key
cityInput.addEventListener("keydown", (event) =>{
    if(event.key === "Enter"){
        searchWeather(cityInput.value.trim());
    }
});