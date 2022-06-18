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
      now = new Date(milliseconds);console.log(milliseconds);
    }
    let date = now.getDate();
 
    let ending = getEndingOfNumeral(date);
    let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
    ];
    let day = days[now.getDay()];
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
 checkCity(response.data.name);
}

navigator.geolocation.getCurrentPosition(definePosition);
let apiKey = "4f7ded0f20193e43384620ed8b03a130";



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
    let humiditySpan = document.querySelector('#humidity');
    let pressureSpan = document.querySelector('#pressure');
    let windSpan = document.querySelector('#wind');
    
    let city = document.querySelector('#city');
    city.innerHTML = response.data.name;
  
  

    currentTemp  = Math.round(response.data.main.temp);
    let currentHumidity = response.data.main.humidity;
    let currentPressure = response.data.main.pressure;
    let currentWindSpeed = Math.round(response.data.wind.speed);
    let currentWindGust = Math.round(response.data.wind.gust);
    let currentWindDegree = response.data.wind.deg;
    // get direction of wind from degree
    let highDegreeDirectionWind = [11.25, 33.75, 56.25, 78.75, 101.25, 123.75, 146.25, 168.75, 191.25, 213.75, 236.25, 258.75, 281.25, 303.75, 326.25, 348.75, 360]
    let directionsWind =['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N']
    let numberOfDirection = highDegreeDirectionWind.findIndex(elem => elem >= currentWindDegree);
    let directionWind = directionsWind[numberOfDirection];

    let currentWind;
    if(currentWindGust && currentWindGust!==currentWind){
        currentWind = `${currentWindSpeed}-${currentWindGust} m/s, ${directionWind}`
    }else{
        currentWind = `${currentWindSpeed} m/s, ${directionWind}`
    }

    let clouds = response.data.weather[0].icon;
    document.getElementById('clouds').src = `https://openweathermap.org/img/wn/${clouds}@2x.png`;
    temperatureSpan.innerHTML = currentTemp ;
    humiditySpan.innerHTML = `${currentHumidity} %`;
    pressureSpan.innerHTML = `${currentPressure} hPa`;
    windSpan.innerHTML = currentWind;

     let timezone = response.data.timezone;
     getCurrentDate(timezone);
}






//-------------CHANGE TEMPERATURE FROM C° TO F°------------
let currentTemp;
let temperatureSpan = document.querySelector('#cur-temp');


let measureSpan = document.querySelector('#celsius-fahrenheit');
measureSpan.addEventListener('click', convertTemperature);

function convertTemperature(event){
    event.preventDefault();
    let celsius = document.querySelector('#celsius');
    let fahrenheit = document.querySelector('#fahrenheit');
    let currentMeasure = document.querySelector('#celsius-fahrenheit>.text-dark');
   
    
    if (event.target == currentMeasure) {
        return;
    } else if(event.target == celsius||event.target == fahrenheit){
        
        currentMeasure.classList.remove("text-dark");
        event.target.classList.add("text-dark");
       
        if (event.target == celsius) {
            currentTemp = Math.round((currentTemp  -32) / 1.8);
        } else {
            currentTemp = Math.round(currentTemp * 1.8 + 32);
        }
        temperatureSpan.innerHTML = currentTemp;
    }
}