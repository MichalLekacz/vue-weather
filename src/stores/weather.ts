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

interface WeatherHistory {
  cityId: number;
  data: {
    time: string;
    temp: number;
    humidity: number;
  }[];
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    selectedCities: [] as City[],
    weatherHistory: [] as WeatherHistory[],
    updateIntervals: {} as Record<number, number>, // Śledzenie interwałów dla poszczególnych miast
  }),

  actions: {
    // 🔹 Pobiera dane pogodowe dla wybranego miasta
    async fetchWeather(cityName: string) {
      try {
        const response = await axios.get(`${BASE_URL}/weather`, {
          params: { q: cityName, appid: API_KEY, units: 'metric' }
        });

        const weather: WeatherData = {
          temp: response.data.main.temp,
          humidity: response.data.main.humidity,
          icon: response.data.weather[0].icon
        };

        const cityData: City = {
          id: response.data.id,
          name: response.data.name,
          weather
        };

        // Dodaj miasto do listy, jeśli jeszcze go nie ma
        if (!this.selectedCities.some(city => city.id === cityData.id)) {
          this.selectedCities.push(cityData);
          this.weatherHistory.push({
            cityId: cityData.id,
            data: []
          });
          // Rozpocznij automatyczne aktualizacje dla nowego miasta
          this.startWeatherUpdates(cityData.id, cityData.name);
        }

        // Aktualizuj dane istniejącego miasta
        const existingCity = this.selectedCities.find(city => city.id === cityData.id);
        if (existingCity) {
          existingCity.weather = weather;
        }

        // Dodaj nowy punkt danych do historii
        const cityHistory = this.weatherHistory.find(h => h.cityId === cityData.id);
        if (cityHistory) {
          cityHistory.data.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: weather.temp,
            humidity: weather.humidity
          });
        }
      } catch (error) {
        console.error('Błąd pobierania pogody:', error);
      }
    },

    // 🔹 Pobiera sugestie miast na podstawie zapytania użytkownika
    async fetchCitySuggestions(query: string) {
      try {
        if (!query || query.length < 2) {
          return []; // Zapytanie zbyt krótkie
        }
    
        const response = await axios.get(`${BASE_URL}/find`, {
          params: { q: query, appid: API_KEY, units: 'metric' }
        });
    
        if (!response.data || !response.data.list) {
          return [];
        }
    
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
      this.stopWeatherUpdates(cityId);
      this.selectedCities = this.selectedCities.filter(city => city.id !== cityId);
      this.weatherHistory = this.weatherHistory.filter(history => history.cityId !== cityId);
    },

    // 🔹 Resetuje miasta (np. po wylogowaniu)
    resetCities() {
      Object.keys(this.updateIntervals).forEach(cityId => {
        this.stopWeatherUpdates(Number(cityId));
      });
      this.selectedCities = [];
      this.weatherHistory = [];
    },

    // 🔹 Rozpoczyna automatyczne aktualizacje pogody
    startWeatherUpdates(cityId: number, cityName: string) {
      this.stopWeatherUpdates(cityId);
      // Ustaw interwał – tutaj aktualizujemy co minutę (60 000 ms)
      this.updateIntervals[cityId] = window.setInterval(() => {
        this.fetchWeather(cityName);
      }, 0.1 * 60 * 1000);
    },

    // 🔹 Zatrzymuje automatyczne aktualizacje
    stopWeatherUpdates(cityId: number) {
      if (this.updateIntervals[cityId]) {
        clearInterval(this.updateIntervals[cityId]);
        delete this.updateIntervals[cityId];
      }
    },

    // 🔹 Pobiera historię pogody dla miasta
    getWeatherHistory(cityId: number) {
      return this.weatherHistory.find(h => h.cityId === cityId)?.data || [];
    },

    // 🔹 Czyści store przy wylogowaniu
    resetStore() {
      this.resetCities();
    }
  }
});
