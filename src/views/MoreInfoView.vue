<template>
	<div class="container py-4">
	  <Header />
	  <h2 class="text-center mt-4">
		Szczegóły Pogody dla: <span class="gradient-text">{{ cityName }}</span>
	  </h2>

	  <div v-if="chartDataTemperature.labels.length > 0" class="mt-4">
		<Line ref="tempChartRef" :data="chartDataTemperature" :options="chartOptionsTemperature" />
	  </div>

	  <div v-if="chartDataHumidity.labels.length > 0" class="mt-4">
		<Line ref="humidityChartRef" :data="chartDataHumidity" :options="chartOptionsHumidity" />
	  </div>

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
	ChartOptions,
	FontSpec,
	LegendOptions,
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
						} as Partial<FontSpec>,
						formatter(value: number) {
							return `${Math.round(value)}°C`;
						},
					},
				},
			],
		});

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
							size: 12,
						} as Partial<FontSpec>,
						formatter(value: number) {
							return `${Math.round(value)}%`;
						},
					},
				},
			],
		});

		const chartOptionsTemperature = ref<ChartOptions<'line'>>({
			responsive: true,
			plugins: {
				legend: {
					position: 'top' as LegendOptions['position'],
					labels: {
						font: {
							size: 24,
						} as Partial<FontSpec>,
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
					} as Partial<FontSpec>,
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

		const chartOptionsHumidity = ref<ChartOptions<'line'>>({
			responsive: true,
			plugins: {
				legend: {
					position: 'top' as LegendOptions['position'],
					labels: {
						font: {
							size: 24,
						} as Partial<FontSpec>,
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
					} as Partial<FontSpec>,
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

		const cityId = computed(() => {
			const city = store.selectedCities.find(c => c.name === props.cityName);
			return city?.id;
		});

		const tempChartRef = ref<any>(null);
		const humidityChartRef = ref<any>(null);

		watch(
			() => cityId.value && store.getWeatherHistory(cityId.value),
			(historyData) => {
				if (!historyData || !Array.isArray(historyData)) return;

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

				nextTick(() => {
					if (tempChartRef.value?.chartInstance) {
						tempChartRef.value.chartInstance.update();
					}
					if (humidityChartRef.value?.chartInstance) {
						humidityChartRef.value.chartInstance.update();
					}
				});
			},
			{ immediate: true, deep: true }
		);

		onMounted(() => {
			const city = store.selectedCities.find(c => c.name === props.cityName);
			if (city) {
				store.fetchWeather(city.name);
			}
		});

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
