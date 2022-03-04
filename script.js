import { key } from './constants.js';

const weatherDiv = document.getElementById('weather');
const dayDivs = document.getElementsByClassName('day');
const weekArray = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];

// Return the complete weather API URL string
const getURL = type => {
  const cityCode = '4952468';
  const isCurrent = type === 'current';
  return isCurrent
    ? `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&units=imperial&appid=${key}`
    : `https://api.openweathermap.org/data/2.5/onecall?lat=42.4709&lon=-70.9175&exclude=current,minutely,hourly,alerts&appid=${key}`;
};

// Fetch weather data from the Open Weather API.
// Return JSON
const fetchData = async type => {
  try {
    const response = await fetch(getURL(type));
    const data = await response.json();
    return data;
  } catch {
    console.error(`Failed to resolve ${type} weather API request:`, e);
  }
};

// Saturate weather UI with data
// Update the forecast section and each .day element
const updateForecast = daysArray => {
  [...dayDivs].forEach((el, i) => {
    const { day, desc, tempMax, tempMin, icon } = daysArray[i];
    el.innerHTML = `<h3>${day}</h3><img src='https://openweathermap.org/img/w/${icon}.png'><p>${tempMax}&#176 <span>hi</span></p><p>${tempMin}&#176 <span>lo</span></p><p>${desc}</p>`;
  });
};

const returnDayIndex = timeStamp => {
  // Returns numeric index value to provide associated day of the week
  const dateObj = new Date(timeStamp * 1000);
  return dateObj.getUTCDay();
};

$(() => {
  // Request both current and forecast data
  const buildAllWeather = async () => {
    const currentData = await fetchData('current');
    const forecastData = await fetchData('forecast');
    funnelCurrentWeather(currentData);
    funnelForecastWeather(forecastData);
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

  // Update current weather section
  const updateCurrentWeather = (desc, temp, icon) => {
    const tempEl = document.createElement('p');
    const descEl = document.createElement('p');
    const img = document.createElement('img');

    img.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
    tempEl.appendChild(img);
    tempEl.appendChild(document.createTextNode(`${temp}°`));
    descEl.innerText = desc;

    weatherDiv.appendChild(tempEl);
    weatherDiv.appendChild(descEl);
  };

  const updateBG = icon => {
    // Constructs and updates background style based on OPW icon
    const { tp, bt } = returnColorObject(icon);
    const styleString = `background: ${bt}; background: -webkit-linear-gradient(left top, ${tp}, ${bt}); background: -o-linear-gradient(bottom right, ${tp}, ${bt}); background: -moz-linear-gradient(bottom right, ${tp}, ${bt}); background: linear-gradient(to bottom right, ${tp}, ${bt});`;
    $('html').attr('style', styleString);
  };

  const returnColorObject = icon => {
    const icon0 = icon[0];
    const icon1 = icon[1];
    const isDay = icon[2] === 'd'; // It's daytime

    switch ((icon0, icon1)) {
      case icon0 === 0 && (icon1 === 2 || icon1 === 3): // Kinda' cloudy
        return {
          tp: isDay ? '#5c7b90' : '#9494b8',
          bt: isDay ? '#dbecf0' : '#14141f',
        };
        break;
      case icon0 === 0 && icon1 === 4: // Supa' cloudy
        return {
          tp: isDay ? '#dbecf0' : '#9494b8',
          bt: '#14141f', // Same for day and night
        };
        break;
      case (icon0 === 0 && icon1 === 9) || (icon0 === 1 && icon1 === 0): // Rain
        return {
          tp: isDay ? '#97afb4' : '#08152b',
          bt: isDay ? '#6b6dc7' : '#49869c',
        };
        break;
      case icon0 === 1 && icon1 === 1: // Lightning storm
        return {
          tp: isDay ? '#191b18' : '#241537',
          bt: isDay ? '#744f43' : '#443a22',
        };
        break;
      case icon0 === 1 && icon1 === 3: // Snow
        return {
          tp: isDay ? '#d8d9d9' : '#9494b8',
          bt: isDay ? '#b8dae0' : '#05262e',
        };
        break;
      case icon0 === 5: // Mist
        return {
          tp: isDay ? '#5c7b90' : '#7d999b',
          bt: isDay ? '#dbecf0' : '#14141f',
        };
        break;
      default:
        // Clear
        return {
          tp: isDay ? '#fc504e' : '#032230',
          bt: isDay ? '#83e4fc' : '#343d89',
        };
    }
  };

  // Bit of toggle fun
  const animateBoxToggle = () => {
    // The animate portion of this method can be done with css
    const box = $('#box');
    const minifiedBox = box.hasClass('box-min');
    $('#forecast').animate({ opacity: 1, height: 'toggle' }, 1000);
    minifiedBox
      ? switchClass(box, 'box-min', 'box-full')
      : switchClass(box, 'box-full', 'box-min');
  };

  // Utilities
  const switchClass = (targetElement, classToRemove, classToAdd) => {
    // Custom switchClass method since base jQuery doesn't have this feature....?
    targetElement.removeClass(classToRemove);
    targetElement.addClass(classToAdd);
  };

  // Init clock
  buildAllWeather();

  // Set Intervals
  setInterval(() => buildAllWeather(), 1800000);

  // Add UI
  $('#applet').click(() => animateBoxToggle());
});

// Clock
const clockEl = document.getElementById('clock');
const timeSpan = clockEl.children[0];
const periodSpan = clockEl.children[1];

// Update clock element strings for US format
const updateClock = () => {
  const today = new Date();
  const h = today.getHours();
  const m = today.getMinutes();
  const s = today.getSeconds();
  const n = h >= 12 ? 'PM' : 'AM';
  timeSpan.innerText = getTimeString(h, m, s);
  periodSpan.innerText = n;
};

// Return a concatenated, formatted time string
const getTimeString = (h, m, s) => {
  h = h > 12 ? h - 12 : h === 0 ? 12 : h; // We're demilitarizing these hours, heny
  m = getTwoDigits(m);
  s = getTwoDigits(s);
  return `${h}:${m}:${s}`;
};

// Add a zero when in single digits
const getTwoDigits = n => {
  return n < 10 ? `0${n}` : n;
};

// Init clock
updateClock();

// Set Intervals
setInterval(() => updateClock(), 1000);
