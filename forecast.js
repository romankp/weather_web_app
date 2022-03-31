const dayDivs = document.getElementsByClassName('day');
const weekArray = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'];

const processForecastWeather = data => {
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

// Update the forecast section and each .day element
const updateForecast = daysArray => {
  [...dayDivs].forEach((el, i) => {
    const { day, desc, tempMax, tempMin, icon } = daysArray[i];
    const heading = document.createElement('h3');
    const img = document.createElement('img');
    const descEl = document.createElement('p');

    heading.innerText = day;
    img.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);

    el.append(img);
    el.append(heading);

    for (let i = 0; i <= 1; i++) {
      const p = document.createElement('p');
      const span = document.createElement('span');

      span.innerText = i ? 'lo' : 'hi';
      p.appendChild(document.createTextNode(`${i ? tempMin : tempMax}° `));
      p.append(span);
      el.append(p);
    }

    descEl.innerText = desc;
    el.append(descEl);
  });
};

const returnDayIndex = timeStamp => {
  // Returns numeric index value to provide associated day of the week
  const dateObj = new Date(timeStamp * 1000);
  return dateObj.getUTCDay();
};

export { processForecastWeather };
