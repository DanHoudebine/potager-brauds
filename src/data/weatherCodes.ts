import type { WeatherCodeInfo } from '../types';

// Open-Meteo weather codes → icon + label (FR)
export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { icon: '☀️', label: 'Ciel dégagé' },
  1: { icon: '🌤️', label: 'Peu nuageux' },
  2: { icon: '⛅', label: 'Partiellement nuageux' },
  3: { icon: '☁️', label: 'Couvert' },
  45: { icon: '🌫️', label: 'Brouillard' },
  48: { icon: '🌫️', label: 'Brouillard givrant' },
  51: { icon: '🌦️', label: 'Bruine' },
  53: { icon: '🌦️', label: 'Bruine modérée' },
  55: { icon: '🌧️', label: 'Bruine dense' },
  61: { icon: '🌧️', label: 'Pluie légère' },
  63: { icon: '🌧️', label: 'Pluie' },
  65: { icon: '🌧️', label: 'Forte pluie' },
  71: { icon: '🌨️', label: 'Neige légère' },
  73: { icon: '🌨️', label: 'Neige' },
  75: { icon: '❄️', label: 'Forte neige' },
  80: { icon: '🌦️', label: 'Averses légères' },
  81: { icon: '🌧️', label: 'Averses' },
  82: { icon: '⛈️', label: 'Fortes averses' },
  95: { icon: '⛈️', label: 'Orage' },
  96: { icon: '⛈️', label: 'Orage avec grêle' },
  99: { icon: '⛈️', label: 'Orage violent' },
};

export const RAINY_CODES = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
