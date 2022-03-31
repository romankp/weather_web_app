import { fetchData } from './api.js';
import { initClock } from './clock.js';
import { processCurrentWeather } from './current.js';
import { processForecastWeather } from './forecast.js';

const bodyEl = document.getElementsByTagName('body')[0];

// Request both current and forecast data and process it
const buildAllWeather = async () => {
  const data = await fetchData();
  processCurrentWeather(data);
  processForecastWeather(data);

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
