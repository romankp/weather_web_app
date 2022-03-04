import { key } from './constants.js';

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

export { fetchData };
