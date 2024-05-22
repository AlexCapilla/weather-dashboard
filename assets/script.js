let searchHistoryForWeather = [];
const weatherAPIBaseURL = "https://api.openweathermap.org";
const weatherAppAPIKey = "5a9994c0a9a2b116f83d334037dad9eb";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const todayContainer = document.querySelector("#today");
const forecastContainer = document.querySelector("#forecast");
const weatherHistoryContainer = document.querySelector("#weather-history");


const fetchWeather = (location) => {

}


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
}



const appendWeatherHistory = (search) => {
  if(searchHistoryForWeather.indexOf(search) !== -1) {
    return;
  }
  searchHistoryForWeather.push(search);
  localStorage.setItem("weatherHistory", JSON.stringify(searchHistoryForWeather));
  createSearchHistory();
}


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
  const storedWeatherHistory = JSON.parse(localStorage.getItem("weatherHistory"));
  if(storedWeatherHistory) {
    searchHistoryForWeather = storedWeatherHistory;
  }
  console.log(searchHistoryForWeather);
  createSearchHistory();
}

searchForm.addEventListener("submit", handleSearchFormSubmit);

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
