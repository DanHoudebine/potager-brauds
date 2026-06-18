// ============================================================
//  Météo — Open-Meteo (gratuit, sans clé) + géolocalisation
// ============================================================
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { state, save } from '../state';
import { elOpt } from '../ui/dom';
import { WEATHER_CODES, RAINY_CODES } from '../data/weatherCodes';

const ONE_HOUR = 3600000;

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
  if (state.weather && state.weather.fetched && now - state.weather.fetched < ONE_HOUR) return;

  try {
    const coords = await getCoords();
    if (!coords) return;
    const { lat, lon } = coords;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,precipitation,weathercode,windspeed_10m&daily=temperature_2m_min&forecast_days=3&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const cur = data.current;
    const dailyMins: number[] = data.daily?.temperature_2m_min ?? [];
    const minTemp = dailyMins.length > 0 ? Math.min(...dailyMins) : undefined;
    state.weather = {
      fetched: now,
      lat,
      lon,
      temp: Math.round(cur.temperature_2m),
      rain: cur.precipitation,
      code: cur.weathercode,
      wind: Math.round(cur.windspeed_10m),
      minTemp,
    };
    save();
    renderWeatherWidget();
  } catch {
    /* géoloc refusée / hors-ligne — silencieux */
  }
}

export function renderWeatherWidget(): void {
  const w = state.weather;
  const widget = elOpt('weather-widget');
  if (!widget) return;
  if (!w || !state.prefs.weather) {
    widget.style.display = 'none';
    return;
  }
  const wc = WEATHER_CODES[w.code] || { icon: '🌡️', label: '—' };
  const isRainy = RAINY_CODES.includes(w.code);
  let advice = '';
  if (isRainy && w.rain > 1) advice = "💧 Il pleut — arrosage inutile aujourd'hui";
  else if (w.temp >= 30) advice = '🌡️ Chaleur — arrosez en soirée, pas au soleil';
  else if ((w.minTemp !== undefined && w.minTemp <= 2) || w.temp <= 5)
    advice = `❄️ Gel prévu ${w.minTemp !== undefined ? `(${w.minTemp}°C min)` : ''} — protégez vos plants fragiles`;

  widget.style.display = '';
  widget.innerHTML = `<div class="wx-main"><span class="wx-icon">${wc.icon}</span><div class="wx-body"><div class="wx-temp">${w.temp}°C <span class="wx-label">${wc.label}</span></div>${advice ? `<div class="wx-advice">${advice}</div>` : ''}</div></div>`;
}

export function hasFrostRisk(): boolean {
  const w = state.weather;
  if (!w) return false;
  return (w.minTemp !== undefined && w.minTemp <= 2) || w.temp <= 2;
}
