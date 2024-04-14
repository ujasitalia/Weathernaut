import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Weather() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [icon, setIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // if the user is not logged in, take them to login page
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/login", {
        state: { message: "You have to be logged in to view the home page" },
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // to clear the error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      // when the component unmounts, we need to clear the timer
      return () => clearTimeout(timer);
    }
  }, [error]);

  function kelvinToFahrenheit(kelvin) {
    return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
  }
  // get icon after weatherData is updated
  useEffect(() => {
    const fetchIcon = async () => {
      if (weatherData) {
        const token = JSON.parse(localStorage.getItem("token_data"));
        try {
          const iconResponse = await axios.get(
            `https://weathernaut-api.onrender.com/weather/icon/${weatherData.weather[0].icon}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIcon(iconResponse.data);
        } catch (error) {
          console.error("Error fetching weather icon", error.message);
        }
      }
    };

    fetchIcon();
  }, [weatherData]);

  const fetchWeather = async () => {
    try {
      if (city) {
        const token = JSON.parse(localStorage.getItem("token_data"));
        const response = await axios.get(
          `https://weathernaut-api.onrender.com/weather/city/${city}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeatherData(response.data);
      } else {
        setError("enter city");
      }
    } catch (error) {
      console.error("Error fetching weather data", error.message);
      setError("city not found");
    }
  };

  if (isLoading) {
    return <div className="error">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] bg-gray-100">
      {error && (
        <div className="bg-red-500 text-white py-2 px-4 rounded mb-5">
          <p>{error}</p>
        </div>
      )}
      <h1 className="text-lg md:text-4xl font-bold mb-4">
        Enter your city to get the latest weather updates
      </h1>
      <p className="text-md md:text-xl mb-2">
        Stay informed about the weather conditions in your city with our simple
        and user-friendly weather app.
      </p>
      <p className="text-sm md:text-lg mb-4">
        Our weather app provides up-to-date and reliable weather forecasts for
        your city.
      </p>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mr-2 px-3 py-2 border rounded focus:outline-none shadow focus:shadow-lg"
        />
        <button
          onClick={fetchWeather}
          className="px-3 py-2 bg-[#14213d] hover:bg-[#2b2d42] text-white rounded"
        >
          Get Weather ⛅
        </button>
      </div>
      {weatherData && (
        <div className="flex flex-col items-center bg-white p-10 rounded shadow">
          {/* Display the weather data here */}
          <h2 className="text-2xl font-bold mb-2">{weatherData.name}</h2>
          {/* Display the weather icon */}
          {console.log(icon)}
          <img
            src={`data:image/png;base64,${icon}`}
            alt="weather icon"
            className="w-20 h-20 mb-4"
          />
          <p className="text-xl">{weatherData.weather[0].main}</p>
          <p className="text-lg">
            Temperature: {kelvinToFahrenheit(weatherData.main.temp)}°F
          </p>
          <p className="text-lg">
            Feels Like: {kelvinToFahrenheit(weatherData.main.feels_like)}°F
          </p>
          <p className="text-lg">Humidity: {weatherData.main.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
