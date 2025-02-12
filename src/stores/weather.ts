import { defineStore } from 'pinia';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
  temp: number;
  humidity: number;
  icon: string;
}

interface City {
  id: number;
  name: string;
  weather?: WeatherData;
}

interface ForecastData {
  time: string;
  temp: number;
  humidity: number;
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    selectedCities: [] as City[],
    forecastData: [] as ForecastData[],
  }),

  actions: {
    // 🔹 Pobiera dane pogodowe dla wybranego miasta
    async fetchWeather(cityName: string) {
      try {
        const response = await axios.get(`${BASE_URL}/weather`, {
          params: { q: cityName, appid: API_KEY, units: 'metric' }
        });

        const cityData: City = {
          id: response.data.id,
          name: response.data.name,
          weather: {
            temp: response.data.main.temp,
            humidity: response.data.main.humidity,
            icon: response.data.weather[0].icon
          }
        };

        if (!this.selectedCities.some(city => city.id === cityData.id)) {
          this.selectedCities.push(cityData);
        }
      } catch (error) {
        console.error('Błąd pobierania pogody:', error);
      }
    },

    // 🔹 Pobiera prognozę pogody na kilka godzin
    async fetchForecast(cityName: string) {
      try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
          params: { q: cityName, appid: API_KEY, units: 'metric' }
        });

        const forecast = response.data.list.slice(0, 5).map((item: any) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: item.main.temp,
          humidity: item.main.humidity,
        }));

        this.forecastData = forecast;
      } catch (error) {
        console.error('Błąd pobierania prognozy pogody:', error);
      }
    },

    // 🔹 Pobiera sugestie miast na podstawie zapytania użytkownika
    async fetchCitySuggestions(query: string) {
      try {
        const response = await axios.get(`${BASE_URL}/find`, {
          params: { q: query, appid: API_KEY, units: 'metric' }
        });

        return response.data.list.map((city: any) => ({
          id: city.id,
          name: city.name,
          country: city.sys.country
        }));
      } catch (error) {
        console.error('Błąd pobierania sugestii miast:', error);
        return [];
      }
    },

    // 🔹 Usuwa miasto z listy
    removeCity(cityId: number) {
      this.selectedCities = this.selectedCities.filter(city => city.id !== cityId);
    },

    // 🔹 Resetuje miasta (w celu czyszczenia po wylogowaniu)
    resetCities() {
      this.selectedCities = []; // Zresetuj listę miast
    }
  }
});
