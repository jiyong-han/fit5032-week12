<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const city = ref('Clayton, AU')
const busy = ref(false)
const error = ref('')
const result = ref<{name: string; region: string; temperature: number; humidity: number; wind: number; code: number; time: string; zone: string} | null>(null)
const condition = computed(() => {
 const c = result.value?.code ?? -1
 if (c === 0) return ['☀️', 'Clear sky']
 if (c <= 3) return ['⛅', c === 3 ? 'Overcast' : 'Partly cloudy']
 if (c <= 48) return ['🌫️', 'Fog']
 if (c <= 57) return ['🌦️', 'Drizzle']
 if (c <= 67) return ['🌧️', 'Rain']
 if (c <= 77) return ['❄️', 'Snow']
 if (c <= 82) return ['🌧️', 'Rain showers']
 if (c <= 86) return ['🌨️', 'Snow showers']
 return ['⛈️', 'Thunderstorm']
})
async function getJson(url: string) {
 const r = await fetch(url, { signal: AbortSignal.timeout(15000) })
 if (!r.ok) throw new Error('Weather service is unavailable. Please try again.')
 return r.json()
}
async function search() {
 if (!city.value.trim()) { error.value = 'Enter a city name, such as Clayton, AU.'; result.value = null; return }
 busy.value = true; error.value = ''; result.value = null
 try {
  const parts = city.value.split(',').map(s => s.trim())
  const params = new URLSearchParams({name: parts[0]!, count: '10', language: 'en', format: 'json'})
  if (parts[1]?.length === 2) params.set('countryCode', parts[1].toUpperCase())
  const geo = await getJson('https://geocoding-api.open-meteo.com/v1/search?' + params)
  const place = geo.results?.[0]
  if (!place) throw new Error('City not found. Check the spelling or add a country code, such as AU.')
  const q = new URLSearchParams({latitude: String(place.latitude), longitude: String(place.longitude), current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m', timezone: 'auto'})
  const data = await getJson('https://api.open-meteo.com/v1/forecast?' + q)
  result.value = {name: place.name, region: [place.admin1, place.country].filter(Boolean).join(', '), temperature: data.current.temperature_2m, humidity: data.current.relative_humidity_2m, wind: data.current.wind_speed_10m, code: data.current.weather_code, time: data.current.time.replace('T',' '), zone: data.timezone}
 } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load weather.' }
 finally { busy.value = false }
}
</script>

<template>
 <header class="bar"><a class="brand" :href="`${$router.options.history.base || '/'}`">JH Library</a><nav aria-label="Main"><RouterLink to="/">Home</RouterLink><RouterLink to="/WeatherCheck">Get Weather</RouterLink></nav></header>
 <main>
  <template v-if="route.path === '/WeatherCheck'">
   <p class="eyebrow">PLAN YOUR LIBRARY VISIT</p><h1>Check the weather.</h1>
   <p class="intro">Find the current conditions before you head out.</p>
   <form @submit.prevent="search" class="search"><label for="city">City and country code</label><div class="controls"><input id="city" v-model="city" autocomplete="off" placeholder="Clayton, AU" :disabled="busy"/><button :disabled="busy">{{ busy ? 'Loading…' : 'Get Weather' }}</button></div></form>
   <p v-if="error" class="error" role="alert">{{ error }}</p>
   <section v-if="result" class="weather" aria-live="polite">
    <div><p class="eyebrow">CURRENT CONDITIONS</p><h2>{{ result.name }}</h2><p>{{ result.region }}</p></div>
    <div class="temperature"><span role="img" :aria-label="condition[1]">{{ condition[0] }}</span><strong>{{ result.temperature }}<span class="unit"> °C</span></strong></div><p class="condition">{{ condition[1] }}</p>
    <dl><div><dt>Humidity</dt><dd>{{ result.humidity }}%</dd></div><div><dt>Wind</dt><dd>{{ result.wind }} km/h</dd></div></dl>
    <p class="timestamp">Weather time: {{ result.time }} · {{ result.zone }}</p>
   </section>
   <p v-else-if="!busy && !error" class="empty">Enter a city, then select Get Weather.</p>
   <p class="source">Weather data: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a> · Current conditions are based on weather model data.</p>
  </template>
  <template v-else><p class="eyebrow">WELCOME TO JH LIBRARY</p><h1>A good day starts<br>with a good book.</h1><p class="intro">Check local conditions before your next library visit.</p><RouterLink class="cta" to="/WeatherCheck">Get Weather <span aria-hidden="true">→</span></RouterLink><div class="home-note"><h2>About this project</h2><p>A Vue 3 application for FIT5032 Week 11–12, demonstrating cloud deployment and continuous integration.</p></div></template>
 </main><footer>Jiyong Han · FIT5032 · Week 11–12</footer>
</template>
