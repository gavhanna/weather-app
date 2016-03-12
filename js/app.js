$(document).ready(function(){
	if (navigator.geolocation) {
	  	navigator.geolocation.getCurrentPosition(function(position) {
	    var lati = position.coords.latitude;
	    var longi = position.coords.longitude;
		var url = "https://api.forecast.io/forecast/e9b17063eb0eb18dd082154493fd5361/" + lati + "," + longi;

		$.ajax({
		  url: url,
		  dataType: "jsonp",
		  success: function (data) {
		      console.log(data);

		      var tempCelsius = parseInt((5/9) * (data.currently.temperature - 32));
		if (tempCelsius < 0){
			$("html").css("background-color", "#7EB2E8");
		} else if (tempCelsius < 5){
			$("html").css("background-color", "#0DAFE8");
		} else if (tempCelsius < 10) {
			$("html").css("background-color", "#FFD06B");
		} else if (tempCelsius < 15) {
			$("html").css("background-color", "#FFE652");
		} else if (tempCelsius < 20) {
			$("html").css("background-color", "#FF6600");
		} else if (tempCelsius < 25) {
			$("html").css("background-color", "#E8430C");
		} else if (tempCelsius > 25) {
			$("html").css("background-color", "#FF250D");
		}

		
		$(".container h1").html(data.timezone);
		$("#temp").html(tempCelsius + "<i class='wi wi-celsius'></i> ");
		$("#temp").append("<span class='subtext'>Feels like " + parseInt((5/9) * (data.currently.apparentTemperature - 32)) + "<i class='wi wi-celsius'></i></span>");
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

		function convertTimestamp(timestamp) {
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
	    
		var forecaster = function(number){
			for (var i = 0; i < number; i++){
				$(".forecast").append("<div class='col-xs-4'><p><strong>" + convertTimestamp(data.hourly.data[i].time) + "</strong></p><p><i class='wi wi-forecast-io-" + data.hourly.data[i].icon + "'></i></p><p>" + parseInt((5/9) * (data.hourly.data[i].temperature - 32)) + "<i class='wi wi-celsius'></i>" +"</p><p><i class='wi wi-strong-wind'></i> " + (data.hourly.data[i].windSpeed * 1.61).toFixed(1) + "km/h</p>" + "</div>");

			}
		}
		forecaster(6);
		  }
		});
		});
	}
}); // end ready