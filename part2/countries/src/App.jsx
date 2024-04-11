import { useState, useEffect  } from 'react'
import axios from 'axios'
import './App.css';


const Filter = ({ text, value, change }) => (
  <div>
    {text} <input value={value} onChange={change} />
  </div>
);

const Country = ({country,showCountryDetails}) => {

  return (
  <div>
    {country.name}
    <button value={country.name} onClick={() => showCountryDetails(country)}>Show</button>
    </div>
    )
}

const Weather = ({weather,country}) => {

  const getWeatherIconUrl = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div>
    <h2>Weather in {country.capital}</h2>
    <p>Description: {weather.weather[0].description}</p>
    <p>Temperature: {weather.main.temp}°C</p>
    <img src={getWeatherIconUrl(weather.weather[0].icon)} alt="Weather icon" />
    <p>Wind Speed: {weather.wind.speed} m/s</p>
  </div>
  )
}

const CountryDescription = ({country}) => {
  return (
    <div>
      <h1>{country.name}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} sq. km</p>
      <div>
        <h3>Languages:</h3>
        <ul>
          {country.languages.map(language => (
          <li key={language.name}>{language.name}</li>
          ))}
          </ul>
          </div>
          <img  className="country" src={country.flag} alt={`${country.name} flag`} />
          </div>
  )
}

const Countries = ({ countries, showCountryDetails, weather }) => {

  return countries.length > 1 ? (
    <>
      {countries.map(country => (
        <div key={country.alpha3Code}>
          <Country country={country} showCountryDetails={showCountryDetails} />
        </div>
      ))}
    </>
  ) : (
    <>
      {countries.map(country => (
        <div key={country.alpha3Code}>

          <CountryDescription country={country}/>
          
          {weather && ( <Weather weather={weather} country={country}/> )}
        </div>
      ))}

    </>
  );
};


function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [weather, setWeather] = useState(null);
  

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
    searchCountry(event.target.value);
  }



  const searchCountry = (value) => {

    if (value.trim() === '') {
      setErrorMessage('Please enter a country name')
      setCountries([]);
      return;
    }
    axios
    .get(`https://restcountries.com/v2/name/${value}`)
    .then(response => {
      setCountries(response.data.rates)

      if (response.data.status === 404) {
        setErrorMessage('Country not found')
        setCountries([]);
        return;
      }

      if (response.data.length > 10) {
        setErrorMessage('Too many matches, please provide a more specific query')
        setCountries([]);
        return;
      }
      setCountries(response.data);
      setErrorMessage('');
    })      

  }
  const showCountryDetails = (country) => {
    setCountries([country]);
  };

  useEffect(() => {
    if (countries.length === 1) {
      fetchWeatherData(countries[0].capital);
    }
  }, [countries]);

  const fetchWeatherData = (capital) => {
    const apiKey = import.meta.env.VITE_SOME_KEY;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`)
      .then(response => {
        setWeather(response.data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        setWeather(null);
      });
  };

  return (
    <>
    <Filter text={"find countries"} value={searchTerm} change={handleSearchTerm}/>
    {errorMessage && <p>{errorMessage}</p>}
    <Countries countries={countries} showCountryDetails={showCountryDetails} weather={weather}/>
    </>
  )
}

export default App
