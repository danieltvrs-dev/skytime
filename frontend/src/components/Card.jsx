/**
 * Primitivo de card visual do Skytime.
 * Cada variante define apenas cor/borda/sombra. Padding fica com o consumidor
 * porque varia entre seções (p-6 padrão, p-8 hero, px-6 py-4 strip horária).
 *
 * Variantes:
 *   light     — fundo translúcido claro (Zonas 2: WhatToWear, GoldenHour, Hourly)
 *   lightHero — fundo um pouco mais opaco (Zona 1: WeatherCard, ErrorState)
 *   dark      — fundo grafite com texto cream (Zona 3: DailyForecast, RainTimeline)
 *
 * Usa tokens semânticos (surface, surface-deep, border) que mudam de valor
 * automaticamente no dark mode via .dark no <html>. A variant `dark` ganha
 * fundo ainda mais escuro no modo escuro pra manter o ritmo entre Zona 1 e 3.
 *
 * Hover lift: passa o mouse → card sobe 2px com sombra mais forte (.skytime-card
 * desligado em .reduce-motion via regra no index.css).
 */
const VARIANTS = {
  light: 'bg-surface/70 backdrop-blur-sm border border-border shadow-sm',
  lightHero: 'bg-surface/80 backdrop-blur-sm border border-border shadow-sm',
  dark: 'bg-surface-deep text-cream border border-cream/10 shadow-md',
}

export default function Card({
  variant = 'light',
  as: Tag = 'div',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`skytime-card rounded-3xl ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
