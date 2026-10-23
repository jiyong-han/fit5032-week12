import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: [{path: '/', component: App}, {path: '/WeatherCheck', component: App}] })
createApp(App).use(router).mount('#app')
