const bodyEl = document.getElementsByTagName('body')[0];
const weatherDiv = document.getElementById('weather');

// Destructure current weather data, process it, and pass it down to relevant
const processCurrentWeather = data => {
  const {
    current: { weather, temp },
  } = data;
  const { description, icon } = weather[0];
  const roundedTemp = Math.round(temp);

  updateBG(icon);
  updateCurrentWeather(description, roundedTemp, icon);
};

// Update background style based on the OW API's icon code for the current weather
const updateBG = icon => {
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

// Update current weather section
const updateCurrentWeather = (desc, temp, icon) => {
  const img = weatherDiv.getElementsByTagName('img')[0];
  const tempEl = weatherDiv.getElementsByTagName('p')[0];
  const descEl = weatherDiv.getElementsByTagName('p')[1];
  const tempSpan = tempEl.getElementsByTagName('span')[0];

  img.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  tempSpan.appendChild(document.createTextNode(`${temp}°`));
  descEl.innerText = desc;
};

export { processCurrentWeather };
