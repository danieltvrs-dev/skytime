import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle,
} from 'lucide-react'

/**
 * Mapa: chave semântica vinda do backend (campo `icon`) → componente Lucide.
 * Mantém a apresentação isolada do dado bruto (código WMO).
 * Trocar de biblioteca de ícones amanhã é alterar só este arquivo.
 */
const ICON_MAP = {
  'clear': Sun,
  'mostly-clear': Sun,
  'partly-cloudy': CloudSun,
  'cloudy': Cloud,
  'fog': CloudFog,
  'drizzle': CloudDrizzle,
  'rain': CloudRain,
  'rain-showers': CloudRain,
  'snow': CloudSnow,
  'snow-showers': CloudSnow,
  'thunderstorm': CloudLightning,
  'unknown': HelpCircle,
}

export function getWeatherIcon(key) {
  return ICON_MAP[key] || HelpCircle
}
