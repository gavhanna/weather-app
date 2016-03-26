$(document).ready(function(){
	// $("#clouds").jQlouds({
	// 	minClouds : 3,
	// 	maxClouds : 7,
	// 	maxWidth : 150,
	// 	maxHeight : 80,
	// 	wind : true
	// });
	if (navigator.geolocation) {
	  	navigator.geolocation.getCurrentPosition(function(position) {

	  		// Setting variables for the API link
	    var lati = position.coords.latitude,
		    longi = position.coords.longitude,
				url = "https://api.forecast.io/forecast/e9b17063eb0eb18dd082154493fd5361/" + lati + "," + longi,
				openweatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" +
				lati + "&lon=" + longi +
				"&appid=b1b15e88fa797225412429c1c50c122a";

			// Function for converting UNIX to human-readable time!
			function UNIXtoHour(timestamp) {
				var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
					hh = d.getHours(),
					h = hh,
					min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
					ampm = 'am',
					time;
				if (hh > 12) {
					h = hh - 12;
					ampm = 'pm';
				} else if (hh === 12) {
					h = 12;
					ampm = 'pm';
				} else if (hh == 0) {
					h = 12;
				}
				time = h + ':' + min + ' ' + ampm;
				return time;
				}

				function UNIXtoDay(timestamp) {
				  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
						yyyy = d.getFullYear(),
						mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
						dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
						hh = d.getHours(),
						h = hh,
						min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
						ampm = 'am',
						time;
					if (hh > 12) {
						h = hh - 12;
						ampm = 'pm';
					} else if (hh === 12) {
						h = 12;
						ampm = 'pm';
					} else if (hh == 0) {
						h = 12;
					}
					time = dd;
					return time;
				}

			// Make the AJAX requests
			// Openweather for location only... TODO: find a better way.
			$.ajax({
				url: openweatherURL,
				dataType: "jsonp",
				success: function (data) {
					console.log(data);
					$(".container h1").html(data.name);
				}});

			// forecast.io for all weather data
			$.ajax({
				url: url,
				dataType: "jsonp",
				success: function (data) {
				console.log(data);
				// Change the background color depending on the temperature
				var tempCelsius = parseInt((5/9) * (data.currently.temperature - 32));
				if (tempCelsius < 0){
					$("#temp").css("color", "#EEEEEE");
				} else if (tempCelsius < 5){
					$("#temp").css("color", "#69E2E8");
				} else if (tempCelsius < 10) {
					$("#temp").css("color", "#A0FF74");
				} else if (tempCelsius < 15) {
					$("#temp").css("color", "#FFCE75");
				} else if (tempCelsius < 20) {
					$("#temp").css("color", "#E86969");
				} else if (tempCelsius < 25) {
					$("#temp").css("color", "#E84630");
				} else if (tempCelsius > 25) {
					$("#temp").css("color", "#E8250C");
				}

				// Jam current weather into the DOM
				$("#temp").html(tempCelsius + "<i class='wi wi-celsius'></i> ");
				$("#temp").append("<span class='subtext'>Feels like " + parseInt((5/9) * (data.currently.apparentTemperature - 32)) + "<i class='wi wi-celsius'></i></span>");
					// Switch between C and F. No real reason to actually do this.
					var celsius = true;
					$("#temp").click(function(){
						if (celsius) {
							$("#temp").html(parseInt(data.currently.temperature) + "<i class='wi wi-fahrenheit'></i>");
							$("#temp").append("<span class='subtext'>Feels like " + data.currently.apparentTemperature + "<i class='wi wi-fahrenheit'></i></span>");
							celsius = false;
						} else {
							$("#temp").html(tempCelsius + "<i class='wi wi-celsius'></i>");
							$("#temp").append("<span class='subtext'>Feels like " + parseInt((5/9) * (data.currently.apparentTemperature - 32)) + "<i class='wi wi-celsius'></i></span>");
							celsius = true;
						}
					});
				$("#weather").html("<i class='wi wi-forecast-io-" + data.currently.icon + "'></i> " + data.currently.summary);
				$("#wind").html("<i class='wi wi-strong-wind'></i> " + ((data.currently.windSpeed) * 1.61).toFixed(1) + " km/h");
				$("#chanceOfRain").html("<i class='wi wi-raindrops'></i> " + data.currently.precipProbability * 100 + "%");
				$("#chanceOfRain").append("<span class='subtext'>Chance of rain</span>");
				$("#sunrise").html("<i class='wi wi-sunrise'></i> " + UNIXtoHour(data.daily.data[0].sunriseTime));
				$("#sunset").html("<i class='wi wi-sunset'></i> " + UNIXtoHour(data.daily.data[0].sunsetTime));

				// Function to append a certain amount of hours of forecast
				var hourForecaster = function(number){
					for (var i = 0; i < number; i++){
						var time = UNIXtoHour(data.hourly.data[i].time),
						 	icon = data.hourly.data[i].icon,
						 	temperature = parseInt((5/9) * (data.hourly.data[i].temperature - 32)),
						 	feelsLike = parseInt((5/9) * (data.hourly.data[i].apparentTemperature - 32)),
						 	wind = (data.hourly.data[i].windSpeed * 1.61).toFixed(1);
						 	$("#forecast-hour").append(
							"<div class='col-xs-4'><p><strong>" + time + "</strong></p>" +
							"<p><i class='icon wi wi-forecast-io-" + icon + "'></i></p>" +
							"<p>" + temperature + "<i class='wi wi-celsius'></i>" +"</p>" +
							"<p class='subtext'>Feels like " + temperature + "<i class='wi wi-celsius'></i>" +"</p>" +
							"<p><i class='wi wi-strong-wind'></i> " + wind + "km/h</p>"
							+ "</div>");
						}
						$('#forecast-hour').slick({
							arrows : false,
			        dots : true,
			        slidesToShow : 3,
			        slidesToScroll : 3
			      });
					}

					var dayForecaster = function(number){
					for (var i = 1; i < number; i++){
						var	icon = data.daily.data[i].icon,
							temperatureMax = parseInt((5/9) * (data.daily.data[i].temperatureMax - 32)),
							temperatureMin = parseInt((5/9) * (data.daily.data[i].temperatureMin - 32)),
							wind = (data.daily.data[i].windSpeed * 1.61).toFixed(1),
							summary = data.daily.data[i].summary,
							sunrise = UNIXtoHour(data.daily.data[i].sunriseTime),
							sunset = UNIXtoHour(data.daily.data[i].sunsetTime),
							visibility = ((data.daily.data[i].visibility * 1.61).toFixed(1)),
							chanceOfRain = (data.daily.data[i].precipProbability * 100).toFixed(1),
							cloudCover = parseInt(data.daily.data[i].cloudCover * 100),
							days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
							now = new Date(data.daily.data[i].time * 1000),
							date = UNIXtoDay(data.daily.data[i].time);
							day = days[now.getDay()];

						$("#forecast-daily").append(
							"<div>" +
							"<p><strong>" + day + " " + date +"</strong><br>" +
							"<i class='icon wi wi-forecast-io-" + icon + "'></i></p>" +
							"<p>" + summary +"</p>" +
							"<div class='row'>" + "<div class='col-xs-6'>" +
								"<p><strong>Max:</strong> " + temperatureMax + "<i class='wi wi-celsius'></i>" +"</p>" +
								"<p><strong>Min:</strong> " + temperatureMin + "<i class='wi wi-celsius'></i>" +"</p>" +
								"<p><i class='wi wi-strong-wind'></i> " + wind + "km/h</p>" +
								"<p><strong>Chance of rain:</strong> " + chanceOfRain + "%</p>" +
							"</div>" + "<div class='col-xs-6'>" +
								"<p><strong>Sunrise:</strong> " + sunrise + "</p>" +
								"<p><strong>Sunset:</strong> " + sunset + "</p>" +
								"<p><strong>Visibility:</strong> " + visibility + "km</p>" +
								"<p><strong>Cloud cover:</strong> " + cloudCover + "%</p>" +
							"</div>");
						}
						$('#forecast-daily').slick({
							arrows : false,
			        dots : true,
			        mobileFirst : true
			      });
					}
			hourForecaster(15);
			dayForecaster(7);
				} // end of AJAX success function
			}); // end of AJAX call
		}); // end of getCurrentPosition
	} // end of if

}); // end ready
