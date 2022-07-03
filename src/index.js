//-------------POLYFILL FINDINDEX-----------
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

//-------------CURRENT DATE-----------


function getCurrentDate(timezone){
    let now = new Date();
    let currentTimeZoneOffsetInSec= now.getTimezoneOffset()*60 ;
    if(timezone){
      let milliseconds = now.getTime() + (timezone+currentTimeZoneOffsetInSec)*1000;
      now = new Date(milliseconds);
    }
    let date = now.getDate();
 
    let ending = getEndingOfNumeral(date);
    
    let day = getDayName(now.getDay());
    let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
    ];
    let month = months[now.getMonth()];
    let hours = now.getHours();
    let minutes =now.getMinutes();
    if (minutes <10){
        minutes = `0${minutes}`
    }
    let currentDate =  document.querySelector("#cur-date");
    currentDate.innerHTML = `${day}, ${date}${ending} of ${month}, ${hours}:${minutes}`;
}

getCurrentDate();

function getEndingOfNumeral(numeral){
    let ending;
    if (numeral ===1 || numeral ===21 || numeral ===31) {
        ending = 'st';
    } else if (numeral ===2 || numeral ===22) {
        ending = 'nd';
    } else if (numeral ===3 || numeral ===23) {
        ending = 'rd';
    } else {
        ending = 'th';
    }
    return ending;
}

//-------------CURRENT LOCATION-----------

function definePosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let urlApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(urlApi).then(showCurrentLocation);
}

function showCurrentLocation(response) {
  let currentLocation = document.querySelector("#cur-location");
 currentLocation.innerHTML = response.data.name;
}

navigator.geolocation.getCurrentPosition(definePosition);
let apiKey = "4f7ded0f20193e43384620ed8b03a130";

//-------------DEFAULT CITY-----------
 checkCity('Frankfurt Am Main');
 


//-------------SEARCH ENGINE-----------

function defineCity(event){ 
    event.preventDefault();
    let valueOfSearch = document.querySelector('#search').value;
    let searchCity = valueOfSearch.trim().toLowerCase();
    if(event.currentTarget==navigation){
       searchCity = event.target.textContent;
    }
    checkCity(searchCity);
}

function checkCity(searchCity){
    let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=metric`;
    axios.get(urlApi).then(defineWeather).catch(function(error){console.log('err')});
}

let search = document.querySelector('#search-form');
search.addEventListener('submit', defineCity);

let navigation = document.getElementById("recommended-cities");
navigation.addEventListener('click', defineCity);


function defineWeather(response) {
  
    let currentTemp;
    let temperatureSpan = document.querySelector('#cur-temp');

    let humiditySpan = document.querySelector('#humidity');
    let pressureSpan = document.querySelector('#pressure');
    let windSpan = document.querySelector('#wind');
    
    let city = document.querySelector('#city');
    city.innerHTML = response.data.name;
  
    getForecast(response.data.coord)

    currentTemp  = Math.round(response.data.main.temp);
    let currentHumidity = response.data.main.humidity;
    let currentPressure = response.data.main.pressure;
    let currentWindSpeed = Math.round(response.data.wind.speed);
    let currentWindGust = Math.round(response.data.wind.gust);
    let currentWindDegree = response.data.wind.deg;
    // get direction of wind from degree
   let currentWind = getWind(currentWindSpeed, currentWindGust, currentWindDegree);

    let clouds = response.data.weather[0].icon;
    document.getElementById('clouds').src = `https://openweathermap.org/img/wn/${clouds}@2x.png`;
    temperatureSpan.innerHTML = `${currentTemp}°C` ;
    humiditySpan.innerHTML = `${currentHumidity} %`;
    pressureSpan.innerHTML = `${currentPressure} hPa`;
    windSpan.innerHTML = currentWind;

     let timezone = response.data.timezone;
     getCurrentDate(timezone);
}


function getWind(windSpeed, windGust, windDegree){
    let highDegreeDirectionWind = [11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75, 360]
    let directionsWind =['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N']
    let numberOfDirection = highDegreeDirectionWind.findIndex(elem => elem >= windDegree);
    let directionWind = directionsWind[numberOfDirection];

    let wind;
    if(windGust && windGust!==wind){
        wind = `${windSpeed}-${windGust} m/s, ${directionWind}`
    }else{
        wind = `${windSpeed} m/s, ${directionWind}`
    }

    return wind;
  } 


  function getDayName(index){
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ];

    return days[index];
}


function formatDay(timestamp) {
  let time = new Date(timestamp * 1000);
  let numberOfMonth =time.getMonth();
  let month = numberOfMonth + 1;
  if (month < 10){
    month = '0' + month;
  }
  let date = time.getDate();
  if(date < 10){
    date = '0' + date;
  }
  return{
    date: date,
    day: getDayName(time.getDay()),
    month: month,
    year:time.getYear().toString().slice(1),
  };

}

//-------------Make same height of card title-----------

function makeSameHeight(){
let city = document.querySelector('#city');
let elem1 = city.closest('.card-header');
let elem2 = document.querySelector('#forecast-header');

 let necessaryHeight =  elem1.clientHeight;
 elem2.style.height = necessaryHeight + 'px';
}

makeSameHeight();

window.addEventListener('resize', makeSameHeight);



//-------------FORECAST-----------

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".forecast-body");
  let forecastHTML='';
  
  
  forecast.forEach(function (forecastDay, index) {
    if(index < 5){
      let clouds = forecastDay.weather[0].icon;
      let currentDate=formatDay(forecastDay.dt);
      let maxTemp = Math.round(forecastDay.temp.max);
      if (maxTemp > 0){
        maxTemp = '+' + maxTemp;
      };
      let minTemp = Math.round(forecastDay.temp.min);
      if (minTemp > 0){
        minTemp = '+' + minTemp;
      };
      let humidity = forecastDay.humidity; 
      let pressure = forecastDay.pressure; 
      let windSpeed = Math.round(forecastDay.wind_speed);
      let windGust = Math.round(forecastDay.wind_gust);
      let windDegree = forecastDay.wind_deg;
      let wind  = getWind(windSpeed, windGust, windDegree);
      forecastHTML =
      forecastHTML +
      `
      <tr> 
        <td>
            <span class="fw-bold">${currentDate.day}</span><span class="d-block">${currentDate.date}.${currentDate.month}.${currentDate.year}</span>
        </td>
        <td>
            <img src="https://openweathermap.org/img/wn/${clouds}@2x.png" alt="clouds" width="50px" /><span
              class="px-2"
            >${maxTemp}°C</span
            ><span class="ps-2 text-primary text-opacity-50"
            >${minTemp}°C</span>
        </td>
        <td>${wind}</td>
        <td>${humidity}%</td>
        <td>${pressure} hPa</td>
      </tr>
      `;

      forecastElement.innerHTML = forecastHTML;
    }
  });
}