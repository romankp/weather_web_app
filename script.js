import { key } from './constants.js';

$(() => {
	// Weather
	const weatherDiv = $('#weather');
	const dayDivs = $('.day');
	const weekArray = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];

	const returnURL = type => { // Return the call URL string
		const cityCode = '4952468';
		const isCurrent = type === 'current';
		const endpoint = isCurrent ? 
		'http://api.openweathermap.org/data/2.5/weather' :
		'http://api.openweathermap.org/data/2.5/forecast/daily';
		const count = isCurrent ? '' : '&cnt=8';

		return `${endpoint}?id=${cityCode}&units=imperial${count}&APPID=${key}`;
	};

	const requestWeatherData = async type => { // Fetch data and return resolved JSON
		const response = await fetch(returnURL(type)).catch(e => {console.error(`Fetch request failed: ${e}`)});
		const data = await response.json().catch(e => {console.error(`Failed to resolve response JSON: ${e}`)});
		return data;
	};

	const buildAllWeather = async () => { // Delays the the server call between current and forecast requests
		const currentData = await requestWeatherData('current');
		const forecastData = await requestWeatherData('forecast');
		funnelCurrentWeather(currentData);
		funnelForecastWeather(forecastData);
	};

	const funnelCurrentWeather = data => { // Destructure current weather data and use it to call UI update methods
		const { weather, main } = data;
		const currentWeather = weather[0];
		const temp = Math.round(main.temp);
		const desc = currentWeather.description;
		const icon = currentWeather.icon;

		updateBG(icon);
		updateCurrentWeather(desc, temp, icon);
	};

	const funnelForecastWeather = data => { // Destructure and build forecast weather array, then use it to call UI update method
		const { list } = data
		const forecastDays = [];

		for (let d = 1; d < 8; d++) {
			const { dt } = list[d];
			const { weather, temp } = list[d - 1];
			forecastDays[d - 1] = {
				day: weekArray[returnDayIndex(dt)],
				desc: weather[0].description,
				tempMax: Math.round(temp.max),
				tempMin: Math.round(temp.min),
				icon: weather[0].icon
			}
		};
		
		updateForecast(forecastDays);
	};

	const returnDayIndex = timeStamp => { // Returns numeric index value to provide associated day of the week
		const dateObj = new Date(timeStamp * 1000);
		return dateObj.getUTCDay();
	};

	const updateCurrentWeather = (desc, temp, icon) => { // Updates current weather section
		weatherDiv.html(`<p><img src='http://openweathermap.org/img/w/${icon}.png'>${temp}&#176</p><p>${desc}</p>`);
	};

	const updateForecast = daysArray => { // Updates the forecast section and each .day element
		dayDivs.each((i, el) => {
			const { day, desc, tempMax, tempMin, icon } = daysArray[i];
			$(el).html(`<h3>${day}</h3><img src='http://openweathermap.org/img/w/${icon}.png'><p>${tempMax}&#176 <span>hi</span></p><p>${tempMin}&#176 <span>lo</span></p><p>${desc}</p>`);
		});
	};

	const updateBG = icon => { // changes background gradient based on OPW icon
		let topColor;
		let bottomColor;

		if (icon[2] == "d") { // day
			if (icon[0] == 0 && icon[1] == 2 || icon[0] == 0 && icon[1] == 3) { // kinda' cloudy
				topColor = "#5c7b90";
				bottomColor = "#dbecf0";
			}
			else if (icon[0] == 0 && icon[1] == 4) { // supa' cloudy
				topColor = "#dbecf0";
				bottomColor = "#14141f"
			}
			else if (icon[0] == 0 && icon[1] == 9 || icon[0] == 1 && icon[1] == 0) { // rain
				topColor = "#97afb4";
				bottomColor = "#6b6dc7"
			}
			else if (icon[0] == 1 && icon[1] == 1) { // lightning storm
				topColor = "#191b18";
				bottomColor = "#744f43"
			}
			else if (icon[0] == 1 && icon[1] == 3) { // snow
				topColor = "#d8d9d9";
				bottomColor = "#b8dae0";
			}
			else if (icon[0] == 5) { // misty
				topColor = "#5c7b90";
				bottomColor = "#dbecf0";
			}
			else { // clear
				topColor =  "#fc504e";
				bottomColor = "#83e4fc";
			}
	
			console.log("day time (" + icon[2] + ")");
		} else { // night
			if (icon[0] == 0 && icon[1] == 2 || icon[0] == 0 && icon[1] == 3) { // kinda' cloudy
				topColor = "#9494b8";
				bottomColor = "#14141f";
			}
			else if (icon[0] == 0 && icon[1] == 4) { // supa' cloudy
				topColor = "#9494b8";
				bottomColor = "#14141f";
			}
			else if (icon[0] == 0 && icon[1] == 9 || icon[0] == 1 && icon[1] == 0) { // rain
				topColor = "#08152b";
				bottomColor = "#49869c"
			}
			else if (icon[0] == 1 && icon[1] == 1) { // lightning storm
				topColor = "#241537";
				bottomColor = "#443a22"
			}
			else if (icon[0] == 1 && icon[1] == 3) { // snow
				topColor = "#9494b8";
				bottomColor = "#05262e";
			}
			else if (icon[0] == 5) { // misty
				topColor = "#7d999b";
				bottomColor = "#14141f";
			}
			else { // clear
				topColor = "#032230";
				bottomColor = "#343d89";
			}
			
			console.log("night time (" + icon[2] + ")");
		}

		const style = [
			'background: ' + bottomColor,
			'background: -webkit-linear-gradient(left top, ' + topColor + ', ' + bottomColor + ')',
			'background: -o-linear-gradient(bottom right, ' + topColor + ', ' + bottomColor + ')', 
			'background: -moz-linear-gradient(bottom right, ' + topColor + ', ' + bottomColor + ')',
			'background: linear-gradient(to bottom right, ' + topColor + ', ' + bottomColor + ')'
		].join(';');

		$("html").attr('style', style);
	};



	// Clock
	const clockElement = $("#clock");

	const updateClock = () => { // Updates clock element string
		const today = new Date();
		const h = today.getHours();
		const m = today.getMinutes();
		const s = today.getSeconds();
		const n = h >= 12 ? 'PM' : 'AM';
		clockElement.html(returnTimeString(h, m, s, n));
	};

	const returnTimeString = (h, m, s, n) => { // Returns a concatenated, formatted time string 
		h = h > 12 ? h - 12 : h == 0 ? 12 : h; // We're demilitarizing these hours, heny
	 	m = m < 10 ? `0${m}` : m; // Adds a zero to the minutes when in single digits
		s = s < 10 ? `0${s}` : s; // Adds a zero to the seconds when in single digits
		return `${h}:${m}:${s}<span>${n}</span>`;
	};



	// Bit of toggle fun
	const animateBoxToggle = () => { // The animate portion of this method can be done with css
		const box = $("#box");
		const minifiedBox = box.hasClass("box-min");
		$("#forecast").animate({opacity: 1,	height: "toggle"}, 1000);
		minifiedBox ? switchClass(box, 'box-min', 'box-full') : switchClass(box, 'box-full', 'box-min');
	};



	// Utilities
	const switchClass = (targetElement, classToRemove, classToAdd) => { // Custom switchClass method since base jQuery doesn't have this feature....?
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
	$("#applet").click(() => animateBoxToggle()); 
});