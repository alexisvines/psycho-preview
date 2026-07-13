/** @type {import('tailwindcss').Config} */

// Genera un color Tailwind "vivo": lee su valor de una variable CSS que
// cambia con [data-palette] (definidas en src/index.css), así el botón de
// ThemeSwitcher.jsx puede cambiar TODA la paleta del sitio en runtime sin
// recompilar — cada clase bg-primary-600, text-accent-500/70, etc. sigue
// funcionando (incluido el modificador de opacidad "/N") porque la variable
// guarda el triplete "R G B" sin comas, no un hex.
function withOpacity(variableName) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `rgb(var(${variableName}))`
      : `rgb(var(${variableName}) / ${opacityValue})`
}

const primary = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => [
    s,
    withOpacity(`--color-primary-${s}`),
  ])
)
const accent = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => [
    s,
    withOpacity(`--color-accent-${s}`),
  ])
)

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Instrument Sans: cuerpo/UI — más carácter que Inter sin perder sobriedad.
        sans: ['"Instrument Sans Variable"', 'system-ui', 'sans-serif'],
        // Newsreader: serif editorial (eje óptico), reemplaza a Fraunces —
        // la itálica queda reservada para un único uso (la cita del hero).
        display: ['"Newsreader Variable"', 'Georgia', 'serif'],
      },
      colors: {
        primary,
        accent,
        cream: {
          DEFAULT: withOpacity('--color-cream-DEFAULT'),
          50: withOpacity('--color-cream-50'),
          100: withOpacity('--color-cream-100'),
        },
        // Blanco cálido para cards elevadas: sobre un papel ya entonado
        // (nunca blanco puro), esto es lo que hace que una card "se despegue".
        surface: withOpacity('--color-surface'),
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9',
      },
      boxShadow: {
        // Sombras tintadas con la tinta de la paleta activa (no negro
        // neutro): las de 4-5% de negro eran invisibles sobre papel cálido.
        card: '0 1px 2px rgb(var(--color-primary-950) / 0.06), 0 6px 16px -4px rgb(var(--color-primary-950) / 0.10)',
        'card-hover': '0 2px 4px rgb(var(--color-primary-950) / 0.07), 0 16px 32px -8px rgb(var(--color-primary-950) / 0.16)',
        lifted: '0 24px 48px -16px rgb(var(--color-primary-950) / 0.28)',
        button: '0 1px 2px rgb(var(--color-primary-950) / 0.10), inset 0 1px 0 rgb(255 255 255 / 0.12)',
      },
      keyframes: {
        shimmer: {
          '0%': {
            backgroundPosition: '-1000px 0',
          },
          '100%': {
            backgroundPosition: '1000px 0',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
