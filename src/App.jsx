import { useEffect, useState } from "react";
import "./App.css";
import wind from "./assets/images/wind.png";
import humidity from "./assets/images/humidity.png";
import search from "./assets/images/search.png";
import { citiesData } from "./assets/data/cities.js";
import { motion } from "motion/react";

function autoComplete(word, setCities) {
  let res = [];
  res = citiesData.filter((w) => {
    return w.toLowerCase().includes(word.toLowerCase());
  });
  setCities(res);
}

function displaySuggList(cities, setCity, setHide) {
  return cities.map((res) => {
    return (
      <li
        key={res}
        data-value={res}
        onClick={(e) => {
          setCity(e.currentTarget.dataset.value);
          setHide(true);
        }}
      >
        {" "}
        {res}{" "}
      </li>
    );
  });
}

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = import.meta.env.VITE_URL;
  const [data, setData] = useState([]);
  const [city, setCity] = useState("Casablanca");
  const [datee, setDatee] = useState(0);
  const [cities, setCities] = useState([]);
  const [hide, setHide] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${url}${city}&appid=${apiKey}&units=metric`,
      );
      if (!response.ok) {
        const response = await fetch(
          `${url}Casablanca&appid=${apiKey}&units=metric`,
        );
        const results = await response.json();
        setData(results);
      } else {
        const results = await response.json();
        setData(results);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
    const timezone = data.timezone;
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezone * 1000);

    setDatee(localTime.toLocaleTimeString());
  }, [data.timezone]);
  function getData() {
    fetchData();
  }

  return (
    <>
      {data && data.weather ? (
        <motion.div
          initial={{ y: "100%", x: "0%", opacity: 0 }}
          animate={{
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
              duration: 1,
            },
          }}
          className="Card"
        >
          <div className="search-div">
            <div className="ok">
              <input
                type="text"
                value={city}
                placeholder="City name"
                className="search-bar"
                onChange={(e) => {
                  setCity(e.currentTarget.value);
                  setHide(false);
                  autoComplete(e.currentTarget.value, setCities);
                }}
              />
              <div className="sugg">
                {hide === false &&
                  cities.length !== 177 &&
                  displaySuggList(cities, setCity, setHide)}
              </div>
            </div>
            <button
              className="search-button"
              onClick={() => {
                getData();
                setHide(true);
              }}
            >
              <img className="search-icon" src={search} alt="weather-search" />
            </button>
          </div>
          <motion.div
            key={data.name}
            initial={{ opacity: 0, y: "0%", x: "9%" }}
            animate={{ opacity: 1, y: 0, x: 0, transition: { duration: 0.5 } }}
            style={{
              "border-top": "1px solid rgb(155, 155, 155)",
              "padding-top": "20px",
            }}
          >
            <div className="cityName">{data.name}</div>
            <div className="icon">
              <img
                src={`/images/${data.weather[0].icon}.png`}
                alt="weather icon"
                className="icon-image"
              />
              <div style={{ fontWeight: "450" }}>
                {" "}
                {data.weather[0].description}{" "}
              </div>
            </div>
            <div className="temp">{Math.floor(data.main?.temp)} &#8451;</div>
          </motion.div>
          <motion.div
            key={data.name + "1"}
            initial={{ y: "0%", x: "-9%" }}
            animate={{ y: 0, x: 0, transition: { duration: 0.5 } }}
            className="add-data"
          >
            <div className="add-data1">{datee}</div>
            <div className="add-data2">
              <img src={humidity} alt="humidity" className="humidity-img" />
              {data?.main?.humidity}
            </div>
            <div className="add-data3">
              <img src={wind} alt="wind-speed" className="wind-speed-img" />
              {data?.wind?.speed}
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <div className="Card">
          <div className="search-div">
            <div className="ok">
              <input
                type="text"
                placeholder="City name"
                className="search-bar"
                value={""}
                disabled
              />
            </div>
            <button className="search-button">
              <img className="search-icon" src={search} alt="weather-search" />
            </button>
          </div>
          <div className="cityName">Loading..</div>
          <div className="icon">
            <img
              src={`/images/loading.png`}
              alt="weather icon"
              className="icon-image"
            />
          </div>
          <div className="temp">NaN &#8451;</div>
          <div className="add-data">
            <div className="add-data1">NaN</div>
            <div className="add-data2">
              <img src={humidity} alt="humidity" className="humidity-img" />
              NaN
            </div>
            <div className="add-data3">
              <img src={wind} alt="wind-speed" className="wind-speed-img" />
              NaN
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
