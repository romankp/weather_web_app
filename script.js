$(() => {
	// Weather
	const returnURL = type => { // Return the call URL string
		const key = 'cb898157c02b3b9e715e19cccadb2122';
		const cityCode = '4954380';
		const isCurrent = type === 'current';
		const endpoint = isCurrent ? 
		'http://api.openweathermap.org/data/2.5/weather' :
		'http://api.openweathermap.org/data/2.5/forecast/daily';
		const count = isCurrent ? '' : '&cnt=8';
		return `${endpoint}?id=${cityCode}&units=imperial${count}&APPID=${key}`;
	};

	const requestAllWeather = () => { // Delays the the server call between current and forecast requests
		weather.request('current');
		setTimeout(() => weather.request('forecast'), 1000);
	};

	const weather = {
		request: function(type) { // load JSON encoded data and parse out the neccessary info
			$.getJSON(returnURL(type), data => {
				if (type == "current") {
					var weatherSpread = data;
					console.log(weatherSpread);

					var desc = weatherSpread.weather[0].description;
					var temp = Math.round(weatherSpread.main.temp);
					var icon = weatherSpread.weather[0].icon;

					weather.updateApplet(desc, temp, icon);
				}
				else {
					var weatherSpread = data;
					console.log(weatherSpread);

					var forecastDays = [];

					for (d = 1; d < 8; d++) {
						var timeStamp = weatherSpread.list[d].dt;
						var dateObj = new Date(timeStamp * 1000);
						var dayNum = dateObj.getUTCDay();
						var week = [
							"SUN",
							"MON",
							"TUES",
							"WED",
							"THUR",
							"FRI",
							"SAT"
						];

						forecastDays[d - 1] = {
							day: week[dayNum],
							desc: weatherSpread.list[d - 1].weather[0].description,
							tempMax: Math.round(weatherSpread.list[d - 1].temp.max),
							tempMin: Math.round(weatherSpread.list[d - 1].temp.min),
							icon: weatherSpread.list[d - 1].weather[0].icon
						}
					};

					test(forecastDays.length == 7, "7 items (days) are not being loaded into the forecastDays array in request")
					
					weather.updateAppletForecast(forecastDays);
				}
			});
		},

		updateApplet: function(desc, temp, icon) { // updates applet with current weather
			var desc = desc;
			var temp = temp;
			var icon = icon;

			var weatherDiv = $("#weather");

			test(weatherDiv.length, "weatherDiv in updateApplet is not being populated")

			this.updateBG(icon);

			weatherDiv.html("<p><img src='http://openweathermap.org/img/w/" + icon + ".png'>" + temp + "&#176</p><p>" + desc + "</p>");
		},

		updateAppletForecast: function(array) { // updates the forecast portion of the applet, creates the 7 individual day cards
			var forecastDays = array;
			var forecastDiv = $("#forecast");

			test(forecastDiv.length, "forecastDiv in updateAppletForecast is not being populated");

			$(".day").each(function(i){
				var day = forecastDays[i].day;
				var desc = forecastDays[i].desc;
				var tempMax = forecastDays[i].tempMax;
				var tempMin = forecastDays[i].tempMin;
				var icon = forecastDays[i].icon;

				$(this).html("<h3>" + day + "</h3><img src='http://openweathermap.org/img/w/" + icon + ".png'><p>"  + tempMax + "&#176 <span>hi</span></p><p>" + tempMin + "&#176 <span>lo</span></p><p>" + desc + "</p>");
			});

		},

		updateBG: function(i) { // changes background gradient based on OPW icon
			var icon = i;
			var topColor;
			var bottomColor;

			test(icon.length == 3, "icon code in updateBG is not being brought in through i as three characters long");

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

			}

			else { // night
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

			var style = [
				'background: bottomColor',
			    'background: -webkit-linear-gradient(left top, ' + topColor + ', ' + bottomColor + ')',
			    'background: -o-linear-gradient(bottom right, ' + topColor + ', ' + bottomColor + ')', 
			    'background: -moz-linear-gradient(bottom right, ' + topColor + ', ' + bottomColor + ')',
			    'background: linear-gradient(to bottom right, ' + topColor + ', ' + bottomColor + ')'
			].join(';');

			$("html").attr('style', style);
		}
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

	const test = (claim, message) => { // Mini test method
		claim ? true : message;
	};



	// Init clock
	updateClock();
	requestAllWeather();

	// Set Intervals
	setInterval(() => updateClock(), 1000);
	setInterval(() => requestAllWeather(), 1800000);

	// Add UI
	$("#applet").click(() => animateBoxToggle()); 
});