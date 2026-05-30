/**
 * Primitivo de card visual do Skytime.
 * Cada variante define apenas cor/borda/sombra. Padding fica com o consumidor
 * porque varia entre seções (p-6 padrão, p-8 hero, px-6 py-4 strip horária).
 *
 * Variantes:
 *   light     — fundo translúcido claro (Zonas 2: WhatToWear, GoldenHour, Hourly)
 *   lightHero — fundo um pouco mais opaco (Zona 1: WeatherCard, ErrorState)
 *   dark      — fundo grafite com texto paper (Zona 3: DailyForecast, RainTimeline)
 */
const VARIANTS = {
  light: 'bg-white/70 backdrop-blur-sm border border-navy/15 shadow-sm',
  lightHero: 'bg-white/80 backdrop-blur-sm border border-navy/15 shadow-sm',
  dark: 'bg-navy text-cream border border-cream/10 shadow-md',
}

export default function Card({
  variant = 'light',
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`rounded-3xl ${VARIANTS[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
