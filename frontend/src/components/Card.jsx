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
  light: 'bg-white/45 backdrop-blur-sm border border-ink/5 shadow-sm',
  lightHero: 'bg-white/55 backdrop-blur-sm border border-ink/5 shadow-sm',
  dark: 'bg-ink text-paper border border-paper/10 shadow-md',
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
