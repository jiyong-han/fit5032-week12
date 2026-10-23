# JH Library — FIT5032 Week 12

Vue 3 + TypeScript + Vite. Created with Cloudflare C3 2.74.3 and adapted from the Week 10 weather exercise.

## Run

```sh
npm ci
npm run dev
npm run build
```

Open `/WeatherCheck`, enter `Clayton, AU`, and select **Get Weather**. Weather requests use Open-Meteo geocoding and forecast APIs over HTTPS; no secret is embedded. The interface reports network errors and unknown cities.

Cloudflare serves at `/`; GitHub Pages uses `DEPLOY_BASE=/fit5032-week12/`. Vue Router uses `createWebHistory(import.meta.env.BASE_URL)`. Cloudflare `_redirects` serves deep links. GitHub Pages uses a 404 fallback (direct deep-link requests may retain HTTP 404 although the app renders).

Week 12 uses GitHub's artifact deployment action with explicit Pages/OIDC permissions, replacing the studio's older gh-pages branch publication method.

Data attribution: https://open-meteo.com/ (weather model data, non-commercial educational use).
