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
    lastUpdateTimes: {} as Record<number, number>, // Dodajemy śledzenie czasów ostatniej aktualizacji
    isInitialized: {} as Record<number, boolean>, // Dodajemy flagę inicjalizacji dla każdego miasta
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

        // Sprawdzamy czy to pierwsze pobranie dla tego miasta
        if (!this.isInitialized[cityData.id]) {
          this.isInitialized[cityData.id] = true;
          this.lastUpdateTimes[cityData.id] = Date.now();
          // Dodajemy pierwszy punkt
          this.addHistoryPoint(cityData.id, weather);
        } else {
          // Sprawdzamy czy minęło 60 sekund
          const currentTime = Date.now();
          const lastUpdate = this.lastUpdateTimes[cityData.id];
          const timeDiff = currentTime - lastUpdate;

          if (timeDiff >= 60000) { // 60000ms = 1 minuta
            this.lastUpdateTimes[cityData.id] = currentTime;
            this.addHistoryPoint(cityData.id, weather);
          }
        }

        // Aktualizujemy bieżące dane miasta niezależnie od interwału
        const existingCity = this.selectedCities.find(city => city.id === cityData.id);
        if (existingCity) {
          existingCity.weather = weather;
        }

      } catch (error) {
        console.error('Błąd pobierania pogody:', error);
      }
    },

    // Nowa metoda do dodawania punktu historii
    addHistoryPoint(cityId: number, weather: WeatherData) {
      const cityHistory = this.weatherHistory.find(h => h.cityId === cityId);
      if (cityHistory) {
        if (cityHistory.data.length >= 100) {
          cityHistory.data.shift();
        }

        const date = new Date();
        date.setSeconds(0);
        date.setMilliseconds(0);

        cityHistory.data.push({
          time: date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit' 
          }),
          temp: weather.temp,
          humidity: weather.humidity
        });
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
      // Ustawiamy interwał na 60 sekund
      this.updateIntervals[cityId] = window.setInterval(() => {
        this.fetchWeather(cityName);
      }, 60000);
      // Pierwsze pobranie danych
      this.fetchWeather(cityName);
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
