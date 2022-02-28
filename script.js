import { key } from './constants.js';

$(() => {
  // Weather
  const weatherDiv = $('#weather');
  const dayDivs = $('.day');
  const weekArray = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];

  const returnURL = type => {
    // Return the call URL string
    const cityCode = '4952468';
    const isCurrent = type === 'current';
    const endpoint = isCurrent
      ? 'https://api.openweathermap.org/data/2.5/weather'
      : 'https://api.openweathermap.org/data/2.5/forecast/daily';
    const count = isCurrent ? '' : '&cnt=8';

    return `${endpoint}?id=${cityCode}&units=imperial${count}&appid=${key}`;
  };

  const requestWeatherData = async type => {
    // Fetch data and return resolved JSON
    const response = await fetch(returnURL(type)).catch(e => {
      console.error(`Fetch request failed: ${e}`);
    });
    const data = await response.json().catch(e => {
      console.error(`Failed to resolve response JSON: ${e}`);
    });
    return data;
  };

  const buildAllWeather = async () => {
    // Delays the the server call between current and forecast requests
    const currentData = await requestWeatherData('current');
    const forecastData = await requestWeatherData('forecast');
    funnelCurrentWeather(currentData);
    funnelForecastWeather(forecastData);
  };

  const funnelCurrentWeather = data => {
    // Destructure current weather data and use it to call UI update methods
    const { weather, main } = data;
    const currentWeather = weather[0];
    const temp = Math.round(main.temp);
    const desc = currentWeather.description;
    const icon = currentWeather.icon;

    updateBG(icon);
    updateCurrentWeather(desc, temp, icon);
  };

  const funnelForecastWeather = data => {
    // Destructure and build forecast weather array, then use it to call UI update method
    const { list } = data;
    const forecastDays = [];

    for (let d = 1; d < 8; d++) {
      const { dt } = list[d];
      const { weather, temp } = list[d - 1];
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

  const updateCurrentWeather = (desc, temp, icon) => {
    // Updates current weather section
    weatherDiv.html(
      `<p><img src='https://openweathermap.org/img/w/${icon}.png'>${temp}&#176</p><p>${desc}</p>`
    );
  };

  const updateForecast = daysArray => {
    // Updates the forecast section and each .day element
    dayDivs.each((i, el) => {
      const { day, desc, tempMax, tempMin, icon } = daysArray[i];
      $(el).html(
        `<h3>${day}</h3><img src='https://openweathermap.org/img/w/${icon}.png'><p>${tempMax}&#176 <span>hi</span></p><p>${tempMin}&#176 <span>lo</span></p><p>${desc}</p>`
      );
    });
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

  // Clock
  const timeSpan = $('#clock span').first();
  const periodSpan = $('#clock span').last();

  const updateClock = () => {
    // Updates clock element string
    const today = new Date();
    const h = today.getHours();
    const m = today.getMinutes();
    const s = today.getSeconds();
    const n = h >= 12 ? 'PM' : 'AM';
    timeSpan.text(returnTimeString(h, m, s));
    periodSpan.text(n);
  };

  const returnTimeString = (h, m, s) => {
    // Returns a concatenated, formatted time string
    h = h > 12 ? h - 12 : h === 0 ? 12 : h; // We're demilitarizing these hours, heny
    m = returnTwoDigits(m);
    s = returnTwoDigits(s);
    return `${h}:${m}:${s}`;
  };

  const returnTwoDigits = n => {
    // Adds a zero when in single digits
    return n < 10 ? `0${n}` : n;
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
  updateClock();
  buildAllWeather();

  // Set Intervals
  setInterval(() => updateClock(), 1000);
  setInterval(() => buildAllWeather(), 1800000);

  // Add UI
  $('#applet').click(() => animateBoxToggle());
});
