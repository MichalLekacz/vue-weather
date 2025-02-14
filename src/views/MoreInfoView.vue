<template>
	<div class="container py-4">
	  <!-- Komponent Header -->
	  <Header />
  
	  <!-- Tytuł widoku -->
	  <h2 class="text-center mt-4">
		Szczegóły Pogody dla: <span class="gradient-text">{{ cityName }}</span>
	  </h2>
  
	  <!-- Wykres temperatury -->
	  <div v-if="chartDataTemperature.labels.length > 0" class="mt-4">
		<Line ref="tempChartRef" :data="chartDataTemperature" :options="chartOptionsTemperature" />
	  </div>
  
	  <!-- Wykres wilgotności -->
	  <div v-if="chartDataHumidity.labels.length > 0" class="mt-4">
		<Line ref="humidityChartRef" :data="chartDataHumidity" :options="chartOptionsHumidity" />
	  </div>
  
	  <!-- Przycisk powrotu -->
	  <div class="mt-4 text-center">
		<button @click="goBack" class="btn text-white gradient-bg">Powrót</button>
	  </div>
	</div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, watch, computed, onMounted, nextTick } from 'vue';
  import { useWeatherStore } from '../stores/weather';
  import Header from '../components/Header.vue';
  import { Line } from 'vue-chartjs';
  import { useRouter } from 'vue-router';
  import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
  } from 'chart.js';
  import chartjsPluginDatalabels from 'chartjs-plugin-datalabels';
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, chartjsPluginDatalabels);
  
  export default defineComponent({
	name: 'MoreInfoView',
	components: {
	  Header,
	  Line,
	},
	props: {
	  cityName: {
		type: String,
		required: true,
	  },
	},
	setup(props) {
	  const store = useWeatherStore();
	  const router = useRouter();
	  const dataLoaded = ref(false);
  
	  // Dane do wykresu temperatury
	  const chartDataTemperature = ref({
		labels: [] as string[],
		datasets: [
		  {
			label: 'Temperatura (°C)',
			data: [] as number[],
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
			  formatter(value: number) {
				return `${Math.round(value)}°C`;
			  },
			},
		  },
		],
	  });
  
	  // Dane do wykresu wilgotności
	  const chartDataHumidity = ref({
		labels: [] as string[],
		datasets: [
		  {
			label: 'Wilgotność (%)',
			data: [] as number[],
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
			  formatter(value: number) {
				return `${Math.round(value)}%`;
			  },
			},
		  },
		],
	  });
  
	  // Opcje wykresu temperatury
	  const chartOptionsTemperature = ref({
		responsive: true,
		plugins: {
		  legend: {
			position: 'top',
			labels: {
			  font: {
				size: 24,
			  },
			  color: 'grey',
			},
		  },
		  tooltip: {
			mode: 'index',
			intersect: false,
		  },
		  datalabels: {
			color: 'black',
			align: 'top',
			font: {
			  size: 14,
			  weight: 'bold',
			},
		  },
		},
		scales: {
		  y: {
			min: -40,
			max: 50,
			ticks: {
			  callback(value: number) {
				return value + '°C';
			  },
			},
		  },
		},
	  });
  
	  // Opcje wykresu wilgotności
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
			color: 'black',
			align: 'top',
			font: {
			  size: 10,
			  weight: 'bold',
			},
		  },
		},
		scales: {
		  y: {
			min: 0,
			max: 100,
			ticks: {
			  callback(value: number) {
				return value + '%';
			  },
			},
		  },
		},
	  });
  
	  // Znajdź ID miasta na podstawie nazwy przekazanej jako prop
	  const cityId = computed(() => {
		const city = store.selectedCities.find(c => c.name === props.cityName);
		return city?.id;
	  });
  
	  // Referencje do komponentów wykresowych, aby móc ręcznie wywołać update()
	  const tempChartRef = ref<any>(null);
	  const humidityChartRef = ref<any>(null);
  
	  // Obserwacja zmian historii pogody – przy aktualizacji danych wymuszamy zmianę referencji obiektu
	  watch(
		() => cityId.value && store.getWeatherHistory(cityId.value),
		(historyData) => {
		  if (!historyData || !Array.isArray(historyData)) return;
  
		  // Aktualizuj wykresy bez względu na liczbę punktów
		  chartDataTemperature.value = {
			...chartDataTemperature.value,
			labels: historyData.map((item) => item.time),
			datasets: [
			  {
				...chartDataTemperature.value.datasets[0],
				data: historyData.map((item) => Math.round(item.temp)),
			  },
			],
		  };
  
		  chartDataHumidity.value = {
			...chartDataHumidity.value,
			labels: historyData.map((item) => item.time),
			datasets: [
			  {
				...chartDataHumidity.value.datasets[0],
				data: historyData.map((item) => item.humidity),
			  },
			],
		  };
  
		  // Wymuszamy aktualizację wykresów
		  nextTick(() => {
			if (tempChartRef.value?.chartInstance) {
			  tempChartRef.value.chartInstance.update();
			}
			if (humidityChartRef.value?.chartInstance) {
			  humidityChartRef.value.chartInstance.update();
			}
		  });
		},
		 { immediate: true, deep: true } // Dodajemy immediate: true
	  );
  
	  // Po wejściu do widoku moreinfo wykonaj początkowe zapytanie pobierające dane pogodowe
	  onMounted(() => {
		const city = store.selectedCities.find(c => c.name === props.cityName);
		if (city) {
		  store.fetchWeather(city.name);
		}
	  });
  
	  // Funkcja powrotu do poprzedniego widoku
	  const goBack = () => {
		router.push('/weather');
	  };
  
	  return {
		chartDataTemperature,
		chartDataHumidity,
		chartOptionsTemperature,
		chartOptionsHumidity,
		cityName: props.cityName,
		goBack,
		tempChartRef,
		humidityChartRef,
		dataLoaded,
	  };
	},
  });
  </script>
  
  <style scoped>
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
