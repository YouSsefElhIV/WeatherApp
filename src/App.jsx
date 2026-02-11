import { useEffect, useState } from 'react'
import './App.css'
import wind from "./assets/images/wind.png"
import humidity from "./assets/images/humidity.png"

function autoComplete (word, setCities)
{
  const city = ["Tokyo", "Delhi", "Shanghai", "São Paulo", "Mexico City", "Khouribga", "Mumbai", "Beijing", "Dhaka", "Osaka",
      "New York", "Karachi", "Buenos Aires", "Chongqing", "Istanbul", "Kolkata", "Manila", "Lagos", "Rio de Janeiro", "Tianjin",
      "Kinshasa", "Guangzhou", "Los Angeles", "Moscow", "Shenzhen", "Lahore", "Bangalore", "Paris", "Bogotá", "Jakarta",
      "Chennai", "Lima", "Bangkok", "Seoul", "Nagoya", "Hyderabad", "London", "Tehran", "Chicago", "Chengdu",
      "Nanjing", "Wuhan", "Ho Chi Minh City", "Luanda", "Ahmedabad", "Kuala Lumpur", "Xi'an", "Hong Kong", "Dongguan", "Hangzhou",
      "Foshan", "Shenyang", "Riyadh", "Baghdad", "Santiago", "Surat", "Madrid", "Suzhou", "Pune", "Harbin",
      "Houston", "Dallas", "Toronto", "Dar es Salaam", "Miami", "Belo Horizonte", "Singapore", "Philadelphia", "Atlanta", "Fukuoka",
      "Khartoum", "Barcelona", "Johannesburg", "Saint Petersburg", "Qingdao", "Dalian", "Washington", "Yangon", "Jinan",
      "Guadalajara", "Boston", "Monterrey", "Nairobi", "Kabul", "Sapporo", "Zhengzhou", "Milan", "Abu Dhabi", "Rome",
      "Bucharest", "Kiev", "Kampala", "Birmingham", "Munich", "Hanoi", "Addis Ababa", "Athens",
      "Phoenix", "San Antonio", "San Diego", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
      "San Francisco", "Indianapolis", "Seattle", "Denver", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland",
      "Las Vegas", "Memphis", "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
      "Kansas City", "Mesa", "Omaha", "Colorado Springs", "Raleigh", "Long Beach", "Virginia Beach", "Oakland", "Minneapolis",
      "Tulsa", "Bakersfield", "Wichita", "Arlington",
      "Cairo", "Alexandria", "Casablanca", "Abidjan", "Accra", "Kigali", "Dakar", "Algiers", "Tunis", "Tripoli",
      "Lusaka", "Harare", "Kano", "Mogadishu", "Bamako", "Ouagadougou", "Antananarivo", "Port Louis", "Maputo", "Windhoek",
      "Gaborone", "Bujumbura", "Yaoundé", "Douala", "Brazzaville", "Conakry", "Freetown", "Monrovia", "Lilongwe", "Juba",
      "Niamey", "Nouakchott", "Bissau", "Malabo", "Maseru", "Porto-Novo", "Cotonou", "Lomé", "N'Djamena", "Timbuktu"
    ];
    
  
  let res = []
  res = city.filter((w) => {
    return (w.toLowerCase().includes(word.toLowerCase()))
  })
  setCities(res)
}

function displaySuggList(cities, setCity, setHide){
  return (cities.map((res) => {
    return (<li key={res} data-value={res} onClick={(e) => {
      setCity(e.currentTarget.dataset.value)
      setHide(true)
    }}> {res} </li>)
  }))
}


function App() {

  const apiKey = import.meta.env.VITE_API_KEY
  const url = import.meta.env.VITE_URL
  const [ data, setData ] = useState([])
  const [ city, setCity ] = useState("Casablanca")
  const [ datee, setDatee ] = useState(0)
  const [ cities, setCities ] = useState([])
  const [ hide, setHide ] = useState(true)
  
  const fetchData = async () => {
    try {
      const response = await fetch(`${url}${city}&appid=${apiKey}&units=metric`)
      if (!response.ok)
      {
        const response = await fetch(`${url}Casablanca&appid=${apiKey}&units=metric`)
        const results = await response.json()
        setData(results);
      }
      else
      {
        const results = await response.json()
        setData(results);
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
    const timezone = data.timezone
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezone * 1000);
  
    setDatee(localTime.toLocaleTimeString());
  }, [data.timezone])
  function getData(){
    fetchData();
  }


  return (
    <>
    { data && data.weather ? 
      <div className='Card'>
        <div className='search-div'>
          <div className='ok'>
          <input type="text" value={city} placeholder='City name' className='search-bar' onChange={(e) => {
            setCity(e.currentTarget.value)
            setHide(false)
            autoComplete(e.currentTarget.value, setCities)}}/>
            <div className='sugg'>
              {hide === false && cities.length !== 177 && displaySuggList(cities, setCity, setHide)}
            </div>
          </div>
            <button className='search-button' onClick={() => {
              getData()
              setHide(true)
              }}>Search</button>
          </div>
        <div className='cityName'>
          {data.name}
        </div>
        <div className='icon'>
          <img src={`src/assets/images/${data.weather[0].icon}.png`} alt="weather icon" className='icon-image' />
          {data.weather[0].description}
        </div>
        <div className='temp'>
          {Math.floor(data.main?.temp)} &#8451;
        </div>
        <div className='add-data'>
          <div className='add-data1'>
            {datee}
          </div>
          <div className='add-data2'>
            <img src={humidity} alt="humidity" className='humidity-img'/>
            {data?.main?.humidity}
          </div>
          <div className='add-data3'>
            <img src={wind} alt="wind-speed" className='wind-speed-img'/>
            {data?.wind?.speed}
          </div>
        </div>
      </div>
      : <p> Loading... </p>}
    </>
  );
}

export default App

