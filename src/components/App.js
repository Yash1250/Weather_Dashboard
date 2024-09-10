/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";
import { weatherQuotes } from "../utils/constant";
import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import cloudImage from "../images/cloud.png";

function getRandomQuote(condition) {
  const quotes = weatherQuotes[condition.toLowerCase()] || [];
  return quotes.length > 0
    ? quotes[Math.floor(Math.random() * quotes.length)]
    : "";
}

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [leftQuote, setLeftQuote] = useState("");
  const [rightQuote, setRightQuote] = useState("");

  const apiKey = "b03a640e5ef6980o4da35b006t5f2942";

  // Function to get the current date
  const toDate = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const currentDate = new Date();
    const date = `${days[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`;
    return date;
  };

  const search = async (event) => {
    event.preventDefault();
    if (
      event.type === "click" ||
      (event.type === "keypress" && event.key === "Enter")
    ) {
      setWeather({ ...weather, loading: true });

      const url = `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`;

      try {
        const res = await axios.get(url);

        const condition = res?.data?.condition?.description;
        setWeather({ data: res.data, loading: false, error: false });
        setLeftQuote(getRandomQuote(condition));
        setRightQuote(getRandomQuote(condition));
        console.log(leftQuote);
      } catch (error) {
        console.error(
          "Error fetching weather data:",
          error.response ? error.response.data : error.message
        );
        setWeather({ ...weather, data: {}, loading: false, error: true });
      }
    }
  };

  const getWeatherByLocation = async (latitude, longitude) => {
    setWeather({ ...weather, loading: true });
    const url = `https://api.shecodes.io/weather/v1/current?lat=${latitude}&lon=${longitude}&key=${apiKey}`;

    try {
      const res = await axios.get(url);
      const condition = res?.data?.condition?.description;
      setWeather({ data: res.data, loading: false, error: false });
      setLeftQuote(getRandomQuote(condition));
      setRightQuote(getRandomQuote(condition));
    } catch (error) {
      console.error(
        "Error fetching weather data by geolocation:",
        error.response ? error.response.data : error.message
      );
      setWeather({ ...weather, data: {}, loading: false, error: true });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.shecodes.io/weather/v1/current?query=Delhi&key=${apiKey}`;

      try {
        const response = await axios.get(url);
        const condition = response?.data?.condition?.description;
        setWeather({ data: response?.data, loading: false, error: false });
        setLeftQuote(getRandomQuote(condition));
        setRightQuote(getRandomQuote(condition));
      } catch (error) {
        console.error(
          "Error during initial data fetch:",
          error?.response ? error?.response?.data : error?.message
        );
        setWeather({ data: {}, loading: false, error: true });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (weather.data && weather.data.condition) {
        const condition = weather?.data?.condition?.description;
        setLeftQuote(getRandomQuote(condition));
        setRightQuote(getRandomQuote(condition));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [weather]);

  const handleGetLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setWeather({ ...weather, data: {}, loading: false, error: true });
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="App">
      <SearchEngine query={query} setQuery={setQuery} search={search} />
      <button id="locationBtn" onClick={handleGetLocationWeather}>
        Get Weather for My Location
      </button>

      {weather.loading && <h4>Searching...</h4>}

      {weather.error && (
        <span className="error-message">
          Sorry, city not found. Please try again.
        </span>
      )}

      {weather.data && weather.data.condition && (
        <Forecast weather={weather} toDate={toDate} />
      )}

      <div className="quotes-container">
        <div className="left-quote">
          <img
            src={cloudImage}
            className="leftCloud cloud"
            alt="left cloud"
            width={340}></img>
          <p className="paraQuote">{leftQuote}</p>
        </div>

        <div className="right-quote">
          <img
            src={cloudImage}
            className="rightCloud cloud"
            alt="right cloud"
            width={340}></img>
          <p className="paraQuote">{rightQuote}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
