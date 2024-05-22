let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAppAPIKey = "5a9994c0a9a2b116f83d334037dad9eb";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");


const displayCurrentWeather = (city, weatherData) => {
  const date = dayjs().format("M/D/YYYY");
  const tempF = weatherData.main.temp;
  const windMph = weatherData.main.speed;
  const humidity = weatherData.main.humidity;
  const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
  const iconDescription = weatherData.weather[0].description || "No Description";
  

const card = document.createElement("div");
const cardBody = document.createElement("div");
const heading = document.createElement("h3");
const weatherIcon = document.createElement("img");
const temperatureElement = document.createElement("p");
const windElement = document.createElement("p");
const humidityElement = document.createElement("p");

card.setAttribute("class", "card");
cardBody.setAttribute("class", "card-body");
card.append(cardBody);

heading.setAttribute("class", "h3 card-title");
temperatureElement.setAttribute("class", "card-text");
windElement.setAttribute("class", "card-text");
humidityElement.setAttribute("class", "card-text");

heading.textContent = `${city} (${date})`;
weatherIcon.setAttribute("src", iconUrl);
weatherIcon.setAttribute("alt", iconDescription);
heading.append(weatherIcon);
temperatureElement.textContent = `Temperature: ${tempF} F`;
windElement.textContent = `Wind: ${windMph} MPH`;
humidityElement.textContent = `Humidity: ${humidity} %`;
cardBody.append(heading, temperatureElement, windElement, humidityElement);

todayContainer.innerHTML = "";
todayContainer.append(card);


}

const createForecastCard = (forecastData) => {
  const iconUrl = `https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png`;
  const iconDescription = forecastData.weather[0].description || "No Description";
  const temperature = forecastData.main.temp;
  const wind = forecastData.wind.speed;
  const humidity = forecastData.main.humidity;

  const column = document.createElement("div");
  const card = document.createElement("div");
  const cardBody = document.createElement("div");
  const cardTitle = document.createElement("h5");
  const weatherIcon = document.createElement("img");
  const temperatureElement = document.createElement("p");
  const windElement = document.createElement("p");
  const humidityElement = document.createElement("p");

  column.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, temperatureElement, windElement, humidityElement);
  column.setAttribute("class", "col-md");
  column.classList.add("five-day-card");
  card.setAttribute("class", "card");
  cardBody.setAttribute("class", "card-body");
  cardTitle.setAttribute("class", "card-title");
  temperatureElement.setAttribute("class", "card-text");
  windElement.setAttribute("class", "card-text");
  humidityElement.setAttribute("class", "card-text");

  cardTitle.textContent = dayjs(forecastData.dt_txt).format("M/D/YYYY");
  weatherIcon.setAttribute("src", iconUrl);
  weatherIcon.setAttribute("alt", iconDescription);
  temperatureElement.textContent = `Temp: ${temperature} F`;
  windElement.textContent = `Wind: ${wind} MPH`;
  humidityElement.textContent = `Humidity: ${humidity} %`;
  

  forecastContainer.append(column);
}


const displayForecast = (weatherData) => {
  const startDate = dayjs().add(1, "day").startOf("day").unix();
  const endDate = dayjs().add(6, "day").startOf("day").unix();

  const headingColumn = document.createElement("div");
  const heading = document.createElement("h3");
  headingColumn.setAttribute("class", "col-12");
  heading.textContent = "5-day Forecast:";
  headingColumn.append(heading);

  forecastContainer.innerHTML = "";
  forecastContainer.append(headingColumn);

  for (let index = 0; index < weatherData.length; index++) {
    if(weatherData[index].dt >= startDate && weatherData[index].dt < endDate){
      if(weatherData[index].dt_txt.slice(11,13) === "12"){
        
        createForecastCard(weatherData[index]);
        
      }
    }
    
  }
}


const fetchWeather = (location) => {
  const latitude = location.lat;
  const longitude = location.lon;

  const city = location.name;

  const apiURL = `${weatherAPIBaseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;
  fetch(apiURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayCurrentWeather(city, data.list[0]);
      displayForecast(data.list);
    })
    .catch(function (error) {
      console.log(error);
    });
};

const createSearchHistory = () => {
  weatherHistoryContainer.innerHTML = "";
  for (let index = 0; index < searchHistoryForWeather.length; index++) {
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("id", "city-button");
    buttonElement.setAttribute("type", "button");
    buttonElement.setAttribute("class", "btn btn-secondary");
    buttonElement.setAttribute("aria-controls", "today forecast");
    buttonElement.classList.add("history-button");
    buttonElement.setAttribute("data-search", searchHistoryForWeather[index]);
    buttonElement.textContent = searchHistoryForWeather[index];
    weatherHistoryContainer.append(buttonElement);
  }
};

const appendWeatherHistory = (search) => {
  if (searchHistoryForWeather.indexOf(search) !== -1) {
    return;
  }
  searchHistoryForWeather.push(search);
  localStorage.setItem(
    "weatherHistory",
    JSON.stringify(searchHistoryForWeather)
  );
  createSearchHistory();
};

const fetchCoordinates = (search) => {
  // a. url -> endpoint
  // b. paramters -> query string
  // c. fetch -> GET

  const url = `${weatherAPIBaseURL}/geo/1.0/direct?q=${search}&appid=${weatherAppAPIKey}`;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("City not found");
      } else {
        console.log(data);
        console.log(search);
        appendWeatherHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const handleSearchFormSubmit = (event) => {
  event.preventDefault();

  const search = searchInput.value.trim();
  if (search) {
    fetchCoordinates(search);
  }
  searchInput.value = "";
};

const initializeSearchHistory = () => {
  const storedWeatherHistory = JSON.parse(
    localStorage.getItem("weatherHistory")
  );
  if (storedWeatherHistory) {
    searchHistoryForWeather = storedWeatherHistory;
  }

  createSearchHistory();
};

const handleSearchHistoryClick = (event) => {
  if (!event.target.matches(".history-button")) {
    return;
  }

  const buttonElement = event.target;

  const search = buttonElement.getAttribute("data-search");
  fetchCoordinates(search);
};

// Events
initializeSearchHistory();
searchForm.addEventListener("submit", handleSearchFormSubmit);
weatherHistoryContainer.addEventListener("click", handleSearchHistoryClick);

// // Add weatherapp code
// const city = ["Los Angeles", "San Diego", "Tokyo", "Paris", "Barcelona"];
// let url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${weatherAppAPIKey}`;

// // Code from slack
// for (let i = 0; i < city.length; i++) {
//   url = `https://api.openweathermap.org/geo/1.0/direct?q=${city[i]}&appid=${weatherAppAPIKey}`;

//   fetch(url)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log("--------- First request with geolocation --------");
//       console.log(data);

//       const latitude = data[0].lat;
//       const longitude = data[0].lon;
//       console.log(latitude, longitude);

//       const url2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${weatherAppAPIKey}`;
//       fetch(url2)
//         .then(function (response2) {
//           return response2.json();
//         })
//         .then(function (data2) {
//           console.log("--------- Second request with forecase --------");
//           console.log(data2);
//           for (let i = 0; i < data2.list.length; i++) {
//             console.log(data2.list[i].main.temp);
//           }
//         });
//     });
// }
// // end code from slack
