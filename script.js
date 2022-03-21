import { fetchData } from './api.js';
import { initClock } from './clock.js';

const bodyEl = document.getElementsByTagName('body')[0];
const mainPanelDiv = document.getElementById('main-panel');
const weatherDiv = document.getElementById('weather');
const forecastDiv = document.getElementById('forecast');
const dayDivs = document.getElementsByClassName('day');
const weekArray = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];

// Saturate weather UI with data

// Update current weather section
const updateCurrentWeather = (desc, temp, icon) => {
  // If weatherDiv already has child elements, we want to use them instead of creating new ones
  if (weatherDiv.firstChild) {
    const img = weatherDiv.getElementsByTagName('img')[0];
    img.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  } else {
    const tempEl = document.createElement('p');
    const descEl = document.createElement('p');
    const img = document.createElement('img');

    img.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    tempEl.appendChild(img);
    tempEl.appendChild(document.createTextNode(`${temp}°`));
    descEl.innerText = desc;

    weatherDiv.appendChild(tempEl);
    weatherDiv.appendChild(descEl);

    console.log(weatherDiv.getElementsByTagName('img')[0]);
  }
};

const funnelCurrentWeather = data => {
  const { weather, main } = data;
  const currentWeather = weather[0];
  const temp = Math.round(main.temp);
  const desc = currentWeather.description;
  const icon = currentWeather.icon;

  updateBG(icon);
  updateCurrentWeather(desc, temp, icon);
};

// Update the forecast section and each .day element
const updateForecast = daysArray => {
  [...dayDivs].forEach((el, i) => {
    const { day, desc, tempMax, tempMin, icon } = daysArray[i];
    const heading = document.createElement('h3');

    heading.innerText = day;

    el.innerHTML = `<img src='https://openweathermap.org/img/w/${icon}.png'><p>${tempMax}&#176 <span>hi</span></p><p>${tempMin}&#176 <span>lo</span></p><p>${desc}</p>`;
    el.prepend(heading);
  });
};

const funnelForecastWeather = data => {
  const { daily } = data;
  const forecastDays = [];

  for (let d = 1; d < 8; d++) {
    const { dt } = daily[d];
    const { weather, temp } = daily[d - 1];
    forecastDays[d - 1] = {
      day: weekArray[returnDayIndex(dt)],
      desc: weather[0].description,
      tempMax: Math.round(temp.max),
      tempMin: Math.round(temp.min),
      icon: weather[0].icon,
    };
  }

  updateForecast(forecastDays);
};

const returnDayIndex = timeStamp => {
  // Returns numeric index value to provide associated day of the week
  const dateObj = new Date(timeStamp * 1000);
  return dateObj.getUTCDay();
};

// User Interaction
const handleClick = () => {
  forecastDiv.classList.toggle('show');
};

// Interaction Listeners
mainPanelDiv.onclick = handleClick;

// Visuals
// Update background style based on the OW API's icon code for the current weather
const updateBG = icon => {
  // const htmlTag = document.getElementsByTagName('html')[0];
  const { tp, bt } = getColorObject(icon);
  const styleString = `background: ${bt}; background: -webkit-linear-gradient(left top, ${tp}, ${bt}); background: -o-linear-gradient(bottom right, ${tp}, ${bt}); background: -moz-linear-gradient(bottom right, ${tp}, ${bt}); background: linear-gradient(to bottom right, ${tp}, ${bt});`;
  bodyEl.setAttribute('style', styleString);
};

// Return object describing background colors based on the weather API's icon code
const getColorObject = icon => {
  const icon0 = Number(icon[0]);
  const icon1 = Number(icon[1]);
  const isDay = icon[2] === 'd'; // It's daytime

  // Kinda' cloudy
  if (icon0 === 0 && (icon1 === 2 || icon1 === 3))
    return {
      tp: isDay ? '#5c7b90' : '#9494b8',
      bt: isDay ? '#dbecf0' : '#14141f',
    };

  // Supa' cloudy
  if (icon0 === 0 && icon1 === 4)
    return {
      tp: isDay ? '#dbecf0' : '#9494b8',
      bt: '#14141f', // Same for day and night
    };

  // Rain
  if ((icon0 === 0 && icon1 === 9) || (icon0 === 1 && icon1 === 0))
    return {
      tp: isDay ? '#97afb4' : '#08152b',
      bt: isDay ? '#6b6dc7' : '#49869c',
    };

  // Lightning storm
  if (icon0 === 1 && icon1 === 1)
    return {
      tp: isDay ? '#191b18' : '#241537',
      bt: isDay ? '#744f43' : '#443a22',
    };

  // Snow
  if (icon0 === 1 && icon1 === 3)
    return {
      tp: isDay ? '#d8d9d9' : '#9494b8',
      bt: isDay ? '#b8dae0' : '#05262e',
    };

  // Mist
  if (icon0 === 5)
    return {
      tp: isDay ? '#5c7b90' : '#7d999b',
      bt: isDay ? '#dbecf0' : '#14141f',
    };

  // Clear (this is the default)
  return {
    tp: isDay ? '#fc504e' : '#032230',
    bt: isDay ? '#83e4fc' : '#343d89',
  };
};

// Request both current and forecast data and process it
const buildAllWeather = async () => {
  const currentData = await fetchData('current');
  const forecastData = await fetchData('forecast');
  funnelCurrentWeather(currentData);
  funnelForecastWeather(forecastData);

  // Trigger weatherReady
  document.dispatchEvent(weatherReady);
};

// Custom Event
const weatherReady = new Event('weatherReady');

// Init Listeners
document.addEventListener('weatherReady', () => {
  setTimeout(() => {
    bodyEl.classList.add('ready');
  }, 800);
});

// Init app sections
initClock();
buildAllWeather();

// Set interval to call for weather data and rebuild the weather UI every 30 minutes
setInterval(() => buildAllWeather(), 30 * 60 * 1000);
