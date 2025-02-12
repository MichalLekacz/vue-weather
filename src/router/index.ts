import { createRouter, createWebHistory } from 'vue-router'
import WeatherView from '../views/WeatherView.vue'
import LoginView from '../views/LoginView.vue'
import MoreInfoView from '../views/MoreInfoView.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/weather', component: WeatherView },
  { path: '/moreinfo/:cityName', component: MoreInfoView, props: true, name: 'moreinfo' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
