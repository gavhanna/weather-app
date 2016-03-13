$(document).ready(function(){
	if (navigator.geolocation) {
	  	navigator.geolocation.getCurrentPosition(function(position) {
	  		// Setting variables for the API link
	    var lati = position.coords.latitude;
	    var longi = position.coords.longitude;
			var url = "https://api.forecast.io/forecast/e9b17063eb0eb18dd082154493fd5361/" + lati + "," + longi;
			// Function for converting UNIX to human-readable time!
			function UNIXtoHour(timestamp) {
				var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
					hh = d.getHours(),
					h = hh,
					min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
					ampm = 'AM',
					time;		
				if (hh > 12) {
					h = hh - 12;
					ampm = 'PM';
				} else if (hh === 12) {
					h = 12;
					ampm = 'PM';
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
						ampm = 'AM',
						time;
							
					if (hh > 12) {
						h = hh - 12;
						ampm = 'PM';
					} else if (hh === 12) {
						h = 12;
						ampm = 'PM';
					} else if (hh == 0) {
						h = 12;
					}
					
					// ie: 2013-02-18, 8:35 AM	
					time = dd;
						
					return time;
				}

			// Make the AJAX request
			$.ajax({
				url: url,
				dataType: "jsonp",
				success: function (data) {
				console.log(data);
			// Change the background color depending on the temperature
			var tempCelsius = parseInt((5/9) * (data.currently.temperature - 32));
			if (tempCelsius < 0){
				$("body").css("background-color", "#7EB2E8");
			} else if (tempCelsius < 5){
				$("body").css("background-color", "#4DAFE8");
			} else if (tempCelsius < 10) {
				$("body").css("background-color", "#FFD06B");
			} else if (tempCelsius < 15) {
				$("body").css("background-color", "#FFAA00");
			} else if (tempCelsius < 20) {
				$("body").css("background-color", "#FF6600");
			} else if (tempCelsius < 25) {
				$("body").css("background-color", "#E8430C");
			} else if (tempCelsius > 25) {
				$("body").css("background-color", "#FF250D");
			}

			// Jam current weather into the DOM
			$(".container h1").html(data.timezone);
			$("#temp").html(tempCelsius + "<i class='wi wi-celsius'></i> ");
			$("#temp").append("<span class='subtext'>Feels like " + parseInt((5/9) * (data.currently.apparentTemperature - 32)) + "<i class='wi wi-celsius'></i></span>");
				// Switch between C and F. No real reason to actually do this.
				var celsius = true;	
				$("#temp").click(function(){
					if (celsius) {
						$("#temp").html(parseInt(data.currently.temperature) + "<i class='wi wi-fahrenheit'></i>");
						$("#temp").append("<span class='subtext'>Feels like " + data.currently.apparentTemperature + "<i class='wi wi-celsius'></i></span>");
						celsius = false;
					} else {
						$("#temp").html(tempCelsius + "<i class='wi wi-celsius'></i>");
						$("#temp").append("<span class='subtext'>Feels like " + parseInt((5/9) * (data.currently.apparentTemperature - 32)) + "<i class='wi wi-celsius'></i></span>");
						celsius = true;
					}
				});
			$("#weather").html("<i class='wi wi-forecast-io-" + data.currently.icon + "'></i> " + data.currently.summary);
			$("#wind").html("<i class='wi wi-strong-wind'></i> " + ((data.currently.windSpeed) * 1.61).toFixed(1) + " km/h");
			$("#chanceOfRain").html("<i class='wi wi-raindrop'></i> " + data.currently.precipProbability * 100 + "%");
			$("#chanceOfRain").append("<span class='subtext'>Chance of rain</span>");

			// Function to append a certain amount of hours of forecast
			var hourForecaster = function(number){
				for (var i = 0; i < number; i++){
					var time = UNIXtoHour(data.hourly.data[i].time);
					var icon = data.hourly.data[i].icon;
					var temperature = parseInt((5/9) * (data.hourly.data[i].temperature - 32));
					var wind = (data.hourly.data[i].windSpeed * 1.61).toFixed(1);
					$("#forecast-hour").append(
						"<div class='col-xs-4'><p><strong>" + time + "</strong></p>" + 
						"<p><i class='wi wi-forecast-io-" + icon + "'></i></p>" + 
						"<p>" + temperature + "<i class='wi wi-celsius'></i>" +"</p>" + 
						"<p><i class='wi wi-strong-wind'></i> " + wind + "km/h</p>" 
						+ "</div>");
					}
				}

			// Function to append a certain amount of hours of forecast
			var dayForecaster = function(number){
				for (var i = 0; i < number; i++){
					var day = UNIXtoDay(data.daily.data[i].time);
					var icon = data.daily.data[i].icon;
					var temperatureMax = parseInt((5/9) * (data.daily.data[i].temperatureMax - 32));
					var temperatureMin = parseInt((5/9) * (data.daily.data[i].temperatureMin - 32));
					var wind = (data.daily.data[i].windSpeed * 1.61).toFixed(1);
					var summary = data.daily.data[i].summary;
					$("#forecast-daily").append(
						"<div class='col-xs-6'><p><strong>" + day + "<sup>th</sup></strong></p>" + 
						"<p><i class='wi wi-forecast-io-" + icon + "'></i></p>" + 
						"<p>Max: " + temperatureMax + "<i class='wi wi-celsius'></i>" +"</p>" + 
						"<p>Min: " + temperatureMin + "<i class='wi wi-celsius'></i>" +"</p>" + 
						"<p><i class='wi wi-strong-wind'></i> " + wind + "km/h</p>" +
						"<p>" + summary +"</p>" + 
						"</div>");
					}
				}
			hourForecaster(9);
			dayForecaster(8);
				} // end of AJAX success function
			}); // end of AJAX call
		}); // end of getCurrentPosition
	} // end of if
}); // end ready

$("#clouds").jQlouds({
	minClouds : 3,
	maxClouds : 5,
	maxWidth : 150,
	maxHeight : 80,
	wind : true
});