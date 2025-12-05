import React, { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");

  // ------------ ICON MAPPING ------------
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      "01d": "☀️",
      "01n": "🌕",
      "02d": "🌤️",
      "02n": "🌤️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌦️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    };

    return iconMap[iconCode] || "🌈"; // default
  };

  // ------------ FETCH WEATHER API ------------
  const getWeather = async () => {
    if (!city.trim()) return;
    setError("");
    setWeather(null);

    try {
     const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        setError("City not found. Try again.");
        return;
      }

      const data = await res.json();
      setWeather(data);
    } catch {
      setError("Network error. Please try again.");
    }
  };
  const getBackground = (icon: string) => {
  if (icon.includes("01")) {
    // Clear sky
    return "from-blue-500 to-blue-700"; 
  } else if (icon.includes("02") || icon.includes("03") || icon.includes("04")) {
    // Cloudy
    return "from-gray-600 to-gray-800"; 
  } else if (icon.includes("09") || icon.includes("10")) {
    // Rainy
    return "from-blue-900 to-gray-900"; 
  } else if (icon.includes("11")) {
    // Thunderstorm
    return "from-purple-900 to-gray-900"; 
  } else if (icon.includes("13")) {
    // Snow
    return "from-blue-200 to-blue-400"; 
  } else if (icon.includes("50")) {
    // Haze / Fog
    return "from-gray-400 to-gray-600"; 
  }

  return "from-gray-900 to-gray-800"; // default background
};


  return (<div
  className={`min-h-screen w-full bg-gradient-to-br ${
    weather ? getBackground(weather.weather[0].icon) : "from-gray-900 to-gray-800"
  } flex justify-center items-center px-4 transition-all duration-700`}
>

      <div className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 shadow-xl rounded-2xl p-6 text-white">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-6">
          🌦 Weather App
        </h1>

        {/* SEARCH BAR */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={getWeather}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-400 text-center mt-4">{error}</p>
        )}

        {/* WEATHER CARD */}
        {weather && (
          <div className="mt-6 bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">

            {/* CITY NAME */}
            <h2 className="text-2xl font-semibold mb-2">{weather.name}</h2>

            {/* WEATHER ICON */}
            <div className="text-7xl my-3">
              {getWeatherIcon(weather.weather[0].icon)}
            </div>

            {/* TEMPERATURE */}
            <h3 className="text-5xl font-bold">
              {Math.round(weather.main.temp)}°C
            </h3>

            {/* CONDITION */}
            <p className="text-gray-300 mt-1 capitalize">
              {weather.weather[0].description}
            </p>

            {/* EXTRA INFO */}
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-300">
              <p>💧 Humidity: {weather.main.humidity}%</p>
              <p>🌡️ Feels like: {weather.main.feels_like}°C</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
