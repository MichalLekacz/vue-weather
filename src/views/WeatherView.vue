<template>
  <div class="container py-4">
    <!-- Komponent Header -->
    <Header />

    <!-- Pasek wyszukiwania -->
    <div class="mb-3">
      <div class="input-group">
        <input
          v-model="cityName"
          type="text"
          class="form-control"
          placeholder="Wpisz miasto"
          @input="fetchCitySuggestions"
        />
        <button @click="selectCity" class="btn text-white gradient-bg">Dodaj miasto</button>
      </div>
      <ul v-if="citySuggestions.length" class="list-group mt-2">
        <li
          v-for="city in citySuggestions"
          :key="city.id"
          class="list-group-item list-group-item-action"
          @click="setCity(city)"
        >
          {{ city.name }}, {{ city.country }}
        </li>
      </ul>
    </div>

    <!-- Lista miast -->
    <div class="cities-grid">
      <div v-for="city in limitedCities" :key="city.id">
        <div class="card text-center p-3 shadow-sm position-relative text-white bg-black bg-opacity-10">
          <!-- Przycisk usuwania miasta -->
          <button 
            class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
            @click="removeCity(city.id)"
            aria-label="Usuń"
          ></button>

          <h5 class="card-title">{{ city.name }}</h5>
          <!-- Zaokrąglona temperatura -->
          <p class="fw-bold fs-4">{{ Math.round(city.weather?.temp || 0) }}°C</p>
          <p>Wilgotność: {{ city.weather?.humidity }}%</p>

          <!-- Ikona pogody z Bootstrap Icons -->
          <i :class="getWeatherIcon(city.weather?.icon || '')" class="fs-1"></i>

          <!-- Przycisk 'Więcej' z nawigacją do szczegółów -->
          <button 
            class="btn btn-link text-white mt-3" 
            @click="goToMoreInfo(city)">
            Więcej
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content bg-dark">
        <h5>Limit osiągnięty</h5>
        <p>Maksymalna liczba dodanych miast to 10. Usuń niektóre miasta, aby dodać nowe.</p>
        <button @click="showModal = false" class="btn text-white gradient-bg">Zamknij</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useWeatherStore } from '../stores/weather';
import Header from '../components/Header.vue'; // Zaimportuj komponent Header
import { useRouter } from 'vue-router'; // Importujemy Vue Router

export default defineComponent({
  name: 'WeatherView',
  components: {
    Header // Zarejestruj Header jako komponent
  },
  setup() {
    const weatherStore = useWeatherStore();
    const router = useRouter(); // Inicjalizujemy router
    const cityName = ref('');
    const citySuggestions = ref<{ id: number; name: string; country: string }[]>([]);
    const showModal = ref(false);

    const fetchCitySuggestions = async () => {
      if (!cityName.value) return;
      citySuggestions.value = await weatherStore.fetchCitySuggestions(cityName.value);
    };

    const selectCity = () => {
      if (!cityName.value) return;
      if (weatherStore.selectedCities.length >= 10) {
        showModal.value = true;
        return;
      }
      weatherStore.fetchWeather(cityName.value);
      cityName.value = '';
    };

    const setCity = (city: { id: number; name: string; country: string }) => {
      cityName.value = `${city.name}, ${city.country}`;
      citySuggestions.value = [];
    };

    const goToMoreInfo = (city: { name: string }) => {
      router.push({ name: 'moreinfo', params: { cityName: city.name } });
    };

    const getWeatherIcon = (iconCode: string) => {
      switch (iconCode) {
        case '01d':
          return 'bi bi-sun';
        case '01n':
          return 'bi bi-moon';
        case '02d':
        case '02n':
          return 'bi bi-cloud-sun';
        case '03d':
        case '03n':
          return 'bi bi-cloud';
        case '04d':
        case '04n':
          return 'bi bi-clouds';
        case '09d':
        case '09n':
          return 'bi bi-cloud-rain';
        case '10d':
        case '10n':
          return 'bi bi-cloud-drizzle';
        case '11d':
        case '11n':
          return 'bi bi-cloud-lightning';
        case '13d':
        case '13n':
          return 'bi bi-snow';
        case '50d':
        case '50n':
          return 'bi bi-cloud-fog';
        default:
          return 'bi bi-cloud';
      }
    };

    const removeCity = (cityId: number) => {
      weatherStore.removeCity(cityId);
    };

    const limitedCities = computed(() => {
      return weatherStore.selectedCities.slice(0, 10);
    });

    return {
      cityName,
      citySuggestions,
      fetchCitySuggestions,
      selectCity,
      setCity,
      goToMoreInfo,
      getWeatherIcon,
      removeCity,
      weatherStore,
      limitedCities,
      showModal
    };
  }
});
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
  border: none;
}

.cities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 992px) {
  .cities-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .cities-grid {
    grid-template-columns: 1fr;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  width: 30%;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

@media (max-width: 768px) {
  .modal-content {
    width: 90%;
  }
}
</style>
