$(function() {

	var test = function(claim, message) {
		if (claim) {
			return true;
		}
		else {
			return message;
		}
	};



	var weather = {
		key: "cb898157c02b3b9e715e19cccadb2122",
		city: "4954380",
		url: {
			current: "http://api.openweathermap.org/data/2.5/weather",
			forecast: "http://api.openweathermap.org/data/2.5/forecast/daily"
		},

		makeURL: function(type) { // puts together the API call URL
			if (type == "current") {
				return this.url[type] + "?id=" + this.city + "&units=imperial&APPID=" + this.key;
			}
			else {
				return this.url[type] + "?id=" + this.city + "&units=imperial&cnt=8&APPID=" + this.key;
			}
		},



		request: function(type) { // load JSON encoded data and parse out the neccessary info
			$.getJSON(weather.makeURL(type), function(data) {
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



		requestBoth: function() { // delays the the server call between current and forecast requests
			weather.request("current");
			setTimeout(function() { weather.request("forecast"); }, 1000);
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



	var clock = {
		start: function() { // creates Date object, parses time info, and calls timeString to build innerHTML in #clock
			var clockDiv = $("#clock");
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			var n = clock.isAfterNoon(h);
			clockDiv.html(clock.timeString(h, m, s, n));
		},

		addZero: function(n) { // adds a zero to the minutes or seconds when in single digits
			if (n < 10) {
				n = "0" + n;
			}
			return n;
	 	},

	 	americanize: function(h) { // we're demilitarizing these hours, hany
	 		if (h > 12) {
	 			h = h - 12;
	 		}
	 		else if (h == 0) {
	 			h = 12;
	 		}
	 		return h;
	 	},

	 	isAfterNoon: function(h) { // checks if morning or noon
	 		if (h >= 12) {
	 			return "PM";
	 		}
	 		return "AM";
	 	},

	 	timeString: function(h, m, s, n) { // returns a concatenated, fluffed time string 
	 		h = this.americanize(h);
	 		m = this.addZero(m);
	 		s = this.addZero(s);
	 		return h + ":" + m + ":" + s + "<span>" + n + "</span>";
	 	}
	};



	var animations = {
		boxToggle: function() { // toggles visibility of forecast section along with the padding-top of #box
			$("#forecast").animate({
			opacity: 1,
			height: "toggle"
			},
			1000);

			if ($("#box").hasClass("box-min")) {
				$("#box").removeClass("box-min");
				$("#box").addClass("box-full");
			}
			else if ($("#box").hasClass("box-full")) {
				$("#box").removeClass("box-full");
				$("#box").addClass("box-min");
			}
		}
	};



	setInterval(weather.requestBoth(), 1800000);
	setInterval(clock.start, 1000);
	$("#applet").click(animations.boxToggle); // on click, toggles #applet div exapansion to reveal and hide forecast
});