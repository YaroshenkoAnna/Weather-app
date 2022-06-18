let weather = {
  "paris": {
    temp: 19.7,
    humidity: 80
  },
  "tokyo": {
    temp: 17.3,
    humidity: 50
  },
  "lisbon": {
    temp: 30.2,
    humidity: 20
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100
  },
  "moscow": {
    temp: -5,
    humidity: 20
  }
};

let city = prompt('Enter a city?').trim().toLowerCase();
if(weather[city]){
let currentTemp = Math.round(weather[city].temp);
let currentTempInF = Math.round(weather[city].temp * 1.8 + 32);
let currentHumidity = weather[city].humidity;
alert(`It is currently ${currentTemp}°C (${currentTempInF}°F) in ${titleCase(city)} with a humidity of ${currentHumidity}%`);
}else{
  alert (`Sorry, we don't know the weather for this city, try going to ${makeSearchStr(city)}`)
}

function titleCase(str) {
   let splitStr = str.split(' ');
   for (let i = 0; i < splitStr.length; i++) {      
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   return splitStr.join(' '); 
}

function makeSearchStr(str){
  let splitStr = str.split(' ');
  let searchStr ='going to https://www.google.com/search?q=weather'
  for (let i = 0; i < splitStr.length; i++) {      
       searchStr = `${searchStr}+${splitStr[i]}`;     
   }
  return searchStr;
}

