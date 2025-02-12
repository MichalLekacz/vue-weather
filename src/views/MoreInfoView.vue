<template>
    <div class="container py-4">
      <!-- Komponent Header -->
      <Header />
  
      <!-- Tytuł widoku -->
      <h2 class="text-center mt-4">Szczegóły Pogody dla: <span class="gradient-text">{{ cityName }}</span></h2>
  
      <!-- Wykres temperatury -->
      <div v-if="chartDataTemperature.labels.length > 0" class="mt-4">
        <Line :data="chartDataTemperature" :options="chartOptionsTemperature" />
      </div>
  
      <!-- Wykres wilgotności -->
      <div v-if="chartDataHumidity.labels.length > 0">
        <Line :data="chartDataHumidity" :options="chartOptionsHumidity" />
      </div>
  
      <div v-else>
        <p>Ładowanie danych...</p>
      </div>
  
      <!-- Przycisk powrotu -->
      <div class="mt-4 text-center">
        <button @click="goBack" class="btn text-white gradient-bg">Powrót</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useWeatherStore } from '../stores/weather'; // Importujemy store do pogodowych danych
  import Header from '../components/Header.vue'; // Komponent nagłówka
  import { Line } from 'vue-chartjs'; // Import wykresu Line z vue-chartjs
  import { useRouter } from 'vue-router'; // Import routera do obsługi nawigacji
  
  // Rejestracja komponentów Chart.js i pluginu datalabels
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
  import chartjsPluginDatalabels from 'chartjs-plugin-datalabels'; // Import pluginu do etykiet
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, chartjsPluginDatalabels); // Rejestracja pluginu
  
  export default defineComponent({
    name: 'MoreInfoView',
    components: {
      Header, // Komponent nagłówka
      Line, // Komponent wykresu
    },
    props: {
      cityName: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const store = useWeatherStore();
      
      // Dane do wykresu temperatury
      const chartDataTemperature = ref({
        labels: [] as string[], // Etykiety osi X (czas)
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: [] as number[], // Dane temperatury
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            fill: true,
            datalabels: {
              display: true,
              color: 'rgba(255, 99, 132, 1)',
              font: {
                weight: 'bold',
                size: 12,
              },
              formatter(value) {
                return `${Math.round(value)}°C`; // Zaokrąglij temperaturę i dodaj jednostkę
              },
            },
          },
        ],
      });
  
      // Dane do wykresu wilgotności
      const chartDataHumidity = ref({
        labels: [] as string[], // Etykiety osi X (czas)
        datasets: [
          {
            label: 'Wilgotność (%)',
            data: [] as number[], // Dane wilgotności
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: true,
            datalabels: {
              display: true,
              color: 'rgba(54, 162, 235, 1)',
              font: {
                weight: 'bold',
                size: 14,
              },
              formatter(value) {
                return `${Math.round(value)}%`; // Zaokrąglij wilgotność i dodaj jednostkę
              },
            },
          },
        ],
      });
  
      // Opcje wykresu dla temperatury
      const chartOptionsTemperature = ref({
        responsive: true,
        plugins: {
          legend: {
  position: 'top',
  labels: {
    font: {
      size: 24, // Powiększenie czcionki etykiety legendy
    },
    color: 'grey', // Możesz też zmienić kolor tekstu
  },
},
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          datalabels: {
            color: 'black', // Kolor etykiet
            align: 'top', // Pozycjonowanie etykiety nad punktem
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            min: -40,  // Minimalna wartość na osi Y
            max: 50, // Maksymalna wartość na osi Y
            ticks: {
              callback(value: number) {
                return value + '°C'; // Formatowanie temperatury
              },
            },
          },
        },
      });
  
      // Opcje wykresu dla wilgotności
      const chartOptionsHumidity = ref({
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
          datalabels: {
            color: 'black', // Kolor etykiet
            align: 'top', // Pozycjonowanie etykiety nad punktem
            font: {
              size: 10,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            min: 0,  // Minimalna wartość na osi Y
            max: 100, // Maksymalna wartość na osi Y
            ticks: {
              callback(value: number) {
                return value + '%'; // Formatowanie wilgotności
              },
            },
          },
        },
      });
  
      const router = useRouter(); // Używamy routera do nawigacji
  
      // Ładowanie danych na podstawie miasta z URL
      onMounted(() => {
        store.fetchForecast(props.cityName).then(() => {
          const forecastData = store.forecastData;
          
          // Filtrujemy dane, aby pokazać tylko jedną wartość na godzinę (co drugi element jeśli dane są co 30 minut)
          const hourlyData = forecastData.filter((item, index) => {
            return index % 2 === 0; // Co drugi element, jeśli dane są co 30 minut
          });
  
          chartDataTemperature.value.labels = hourlyData.map((item) => item.time); // Czas co godzinę
          chartDataTemperature.value.datasets[0].data = hourlyData.map((item) => Math.round(item.temp)); // Temperatura co godzinę
          
          chartDataHumidity.value.labels = hourlyData.map((item) => item.time); // Czas co godzinę
          chartDataHumidity.value.datasets[0].data = hourlyData.map((item) => item.humidity); // Wilgotność co godzinę
        });
      });
  
      // Funkcja do powrotu do poprzedniego widoku
      const goBack = () => {
        router.push('/weather'); // Możesz ustawić ścieżkę na widok z listą miast
      };
  
      return {
        chartDataTemperature,
        chartDataHumidity,
        chartOptionsTemperature,
        chartOptionsHumidity,
        cityName: props.cityName,
        goBack, // Zwrócenie funkcji do szablonu
      };
    },
  });
  </script>
  
  <style scoped>
  /* Dodaj style dla wykresu */
  .container {
    padding-top: 20px;
  }

  .gradient-bg {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
  border: none;
}

.gradient-text {
  background: linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 87, 34, 1) 100%);
  -webkit-background-clip: text;
  color: transparent;
}
  </style>