// ============================================================
//  Météo — Open-Meteo (gratuit, sans clé) + géolocalisation
// ============================================================
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { state, save } from '../state';
import { elOpt } from '../ui/dom';
import { WEATHER_CODES, RAINY_CODES } from '../data/weatherCodes';

const THIRTY_MIN = 1800000;

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

async function getCoords(): Promise<{ lat: number; lon: number } | null> {
  if (Capacitor.isNativePlatform()) {
    const perm = await Geolocation.requestPermissions();
    if (perm.location !== 'granted' && perm.coarseLocation !== 'granted') return null;
    const pos = await Geolocation.getCurrentPosition({ timeout: 5000, enableHighAccuracy: false });
    return { lat: pos.coords.latitude, lon: pos.coords.longitude };
  }
  if (!navigator.geolocation) return null;
  const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
  );
  return { lat: pos.coords.latitude, lon: pos.coords.longitude };
}

export async function fetchWeather(): Promise<void> {
  if (!state.prefs.weather) return;
  const now = Date.now();
  if (state.weather && state.weather.fetched && now - state.weather.fetched < THIRTY_MIN) return;

  try {
    const coords = await getCoords();
    if (!coords) return;
    const { lat, lon } = coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,precipitation,weathercode,windspeed_10m&daily=temperature_2m_min,temperature_2m_max,weathercode&forecast_days=4&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const cur = data.current;
    const dailyMins: number[] = data.daily?.temperature_2m_min ?? [];
    const dailyMaxs: number[] = data.daily?.temperature_2m_max ?? [];
    const dailyCodes: number[] = data.daily?.weathercode ?? [];
    const minTemp = dailyMins.length > 0 ? Math.min(...dailyMins) : undefined;
    const forecast = dailyMins.slice(1, 4).map((min, i) => ({
      min: Math.round(min),
      max: Math.round(dailyMaxs[i + 1] ?? min),
      code: dailyCodes[i + 1] ?? 0,
    }));
    state.weather = {
      fetched: now,
      lat,
      lon,
      temp: Math.round(cur.temperature_2m),
      rain: cur.precipitation,
      code: cur.weathercode,
      wind: Math.round(cur.windspeed_10m),
      minTemp,
      forecast,
    };
    save();
    renderWeatherWidget();
  } catch {
    /* géoloc refusée / hors-ligne — silencieux */
  }
}

export function renderWeatherWidget(): void {
  const w = state.weather;

  // Petite bannière conseil (au-dessus des stats)
  const banner = elOpt('weather-widget');
  // Carte principale du dashboard
  const card = elOpt('wx-card-body');

  if (!w || !state.prefs.weather) {
    if (banner) banner.style.display = 'none';
    return;
  }

  const wc = WEATHER_CODES[w.code] || { icon: '🌡️', label: '—' };
  const isRainy = RAINY_CODES.includes(w.code);
  let advice = '';
  if (isRainy && w.rain > 1) advice = "💧 Il pleut — arrosage inutile aujourd'hui";
  else if (w.temp >= 33) advice = '🌡️ Chaleur intense — arrosez tôt le matin ou en soirée';
  else if (w.temp >= 28) advice = '☀️ Chaleur — arrosez en soirée, pas en plein soleil';
  else if ((w.minTemp !== undefined && w.minTemp <= 2) || w.temp <= 5)
    advice = `❄️ Gel prévu${w.minTemp !== undefined ? ` (${w.minTemp}°C min)` : ''} — protégez vos plants fragiles`;

  // Bannière
  if (banner) {
    banner.style.display = advice ? '' : 'none';
    if (advice) banner.innerHTML = `<div class="wx-main"><span class="wx-icon">${wc.icon}</span><div class="wx-body"><div class="wx-advice">${advice}</div></div></div>`;
  }

  // Carte complète
  if (!card) return;
  const today = new Date();
  const forecastHtml = (w.forecast || []).map((d, i) => {
    const day = DAYS_FR[(today.getDay() + i + 1) % 7];
    const fc = WEATHER_CODES[d.code] || { icon: '⛅', label: '' };
    return `<div class="day"><div class="d">${day}</div><div class="ic">${fc.icon}</div><div class="t">${d.max}° <small>${d.min}°</small></div></div>`;
  }).join('');

  const frostNote = w.minTemp !== undefined && w.minTemp <= 2
    ? `<div class="mt-3 xsmall urgent" style="color:var(--urgent)">❄️ Gel prévu (${w.minTemp}°C min) — couvrez les plants sensibles</div>`
    : `<div class="mt-3 xsmall muted">Pas de risque de gel ✓</div>`;

  card.innerHTML = `
    <div class="weather-main">
      <div class="wi">${wc.icon}</div>
      <div>
        <div class="temp">${w.temp}°<small>C</small></div>
        <div class="desc">${wc.label}</div>
        <div class="xsmall muted" style="margin-top:2px">💨 ${w.wind} km/h</div>
      </div>
    </div>
    ${forecastHtml ? `<div class="forecast">${forecastHtml}</div>` : ''}
    ${frostNote}
    ${advice ? `<div class="mt-2 xsmall" style="color:var(--green-dark);font-weight:700">${advice}</div>` : ''}
  `;
}

export function hasFrostRisk(): boolean {
  const w = state.weather;
  if (!w) return false;
  return (w.minTemp !== undefined && w.minTemp <= 2) || w.temp <= 2;
}
