$(document).ready(function () {
	$("#city-form").submit(function (event) {
	  event.preventDefault();
	  const city = $("#city-input").val();
	  getWeather(city);
	});
  });
  
  function getWeather(city) {
	const apiKey = "a54723016ff96928cc2accc304afd29c";
	const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
	const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
  
	$.ajax({
	  url: url,
	  method: "GET",
	  success: function (data) {
		const temperature = data.main.temp;
		const feelsLike = data.main.feels_like;
		const humidity = data.main.humidity;
		const windSpeed = data.wind.speed * 3.6;
		const clouds = data.clouds.all;
		const iconCode = data.weather[0].icon;
		const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
  
		$("#weather-data").html(`
		  <h2>Pogoda w: ${city}</h2>
		  <p>Temperatura: ${temperature} &deg;C</p>
		  <p>Temperatura odczuwalna: ${feelsLike} &deg;C</p>
		  <p>Wilgotność: ${humidity} %</p>
		  <p>Prędkość wiatru: ${windSpeed.toFixed(2)} km/h</p>
		  <p>Zachmurzenie: ${clouds} %</p>
		  <img src="${iconUrl}" alt="Weather icon">
		`);
  
		// Show the weather info div
		$(".weather-info").css("display", "block");
	  },
	  error: function () {
		$("#weather-data").html("<p>Nie udało się pobrać informacji o pogodzie.</p>");
  
		// Show the weather info div
		$(".weather-info").css("display", "block");
	  },
	});
  }
  