import { useEffect, useMemo, useState } from "react";
import "./App.css";
import wind from "./assets/images/wind.png";
import humidity from "./assets/images/humidity.png";
import search from "./assets/images/search.png";
import { motion } from "motion/react";

async function fetchData(city, setData) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const url = import.meta.env.VITE_URL;
  try {
    const response = await fetch(`${url}${city}&appid=${apiKey}&units=metric`);
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
}

function getData(city, setData) {
  fetchData(city, setData);
}

function autoComplete(word, citiesData, setCities) {
  let res = citiesData.filter((w) => {
    return w.city.toLowerCase().includes(word.toLowerCase());
  });
  setCities(res);
}

function displaySuggList(cities, setCity, setHide, setData) {
  return cities.slice(0, 50).map((res, index) => {
    return (
      <li
        key={index}
        onClick={() => {
          setCity(res.city);
          setHide(true);
          getData(res.city, setData);
        }}
      >
        {res.city}, {res.country}
      </li>
    );
  });
}

function App() {
  const [data, setData] = useState([]);
  const [city, setCity] = useState(["Casablanca"]);
  const [datee, setDatee] = useState(0);
  const [cities, setCities] = useState([]);
  const [hide, setHide] = useState(true);
  const [citiesData, setCitiesData] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/yassine-khadiri/world-cities/refs/heads/main/world-cities.json`,
        );
        const c = await response.json();
        setCitiesData(c);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    let image = "none";
    if (data &&data.weather)
    {
      if (data?.weather[0]?.icon === "01d")
        image = "dayclear.jpg";
      else if (data?.weather[0]?.icon === "02d" || data?.weather[0]?.icon === "03d")
          image = "daypartcloudy.jpg"
      else if (data?.weather[0]?.icon === "04d")
          image = "daycloudy.jpg"
      else if (data?.weather[0]?.icon === "09d" || data?.weather[0]?.icon === "10d")
          image = "daycloudy.jpg"
      else if (data?.weather[0]?.icon === "11d")
        image = "daythunder.jpg"
      else if (data?.weather[0]?.icon === "13d")
        image = "daysnow.jpg"
      else if (data?.weather[0]?.icon === "50d")
        image = "daymist.jpg"
      else if (data?.weather[0]?.icon === "01n")
        image = "nightclear.jpg";
      else if (data?.weather[0]?.icon === "02n" || data?.weather[0]?.icon === "03n")
          image = "nightpartcloudy.jpg"
      else if (data?.weather[0]?.icon === "04n")
          image = "nightcloudy.jpg"
      else if (data?.weather[0]?.icon === "09n" || data?.weather[0]?.icon === "10n")
          image = "nightcloudy.jpg"
      else if (data?.weather[0]?.icon === "11n")
        image = "nightthunder.jpg"
      else if (data?.weather[0]?.icon === "13n")
        image = "nightsnow.jpg"
      else if (data?.weather[0]?.icon === "50n")
        image = "nightmist.jpg"
    }
      if (image === "none")
        image = `background.jpg`
      document.body.style.background = `url(/images/${image}) no-repeat center`
      document.body.style.backgroundSize = "cover"

  }, [data.weather])

  useEffect(() => {
    fetchData(city, setData);
    const timezone = data.timezone;
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezone * 1000);

    setDatee(localTime.toLocaleTimeString());
  }, [data.timezone]);

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
                  autoComplete(e.currentTarget.value, citiesData, setCities);
                }}
              />
              <div className="sugg">
                {hide === false &&
                  city &&
                  displaySuggList(cities, setCity, setHide, setData)}
              </div>
            </div>
            <button
              className="search-button"
              onClick={() => {
                getData(city, setData);
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
              borderTop: "1px solid rgb(155, 155, 155)",
              paddingTop: "20px",
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
