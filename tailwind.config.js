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
// stone: mismo mecanismo que primary/accent, pero para el gris neutro de
// texto/bordes/fondos de página. En Tailwind por defecto "stone" es una
// escala fija — acá la reemplazamos por una respaldada en variable CSS para
// que TODO el texto/borde/fondo neutro del sitio (la inmensa mayoría de las
// clases text-stone-*/bg-stone-*/border-stone-* ya escritas) se invierta
// solo al activar modo oscuro ([data-theme="dark"] en index.css), sin tener
// que tocar cada componente uno por uno.
const stone = Object.fromEntries(
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => [
    s,
    withOpacity(`--color-stone-${s}`),
  ])
)
// line: el tinte de borde translúcido (antes literal border-primary-900/N)
// separado de la escala primary porque primary-900 cumple doble función —
// bloque de color sólido (paneles oscuros) Y tinte de borde — y esas dos
// funciones necesitan invertirse distinto en modo oscuro. "line" solo
// resuelve el borde.
const line = withOpacity('--color-line')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Modo oscuro: la mayoría de los ajustes de contraste ya vienen gratis de
  // invertir cream/surface/stone/line por variable CSS (arriba). La clase
  // "dark" (aplicada en <html> junto con [data-theme="dark"], ver
  // ThemeContext.jsx) solo se usa como escape hatch puntual — texto en
  // primary-500/600/700 que asume lectura sobre el papel claro y no tiene
  // suficiente contraste sobre el nuevo canvas oscuro (primary/accent NO se
  // invierten: son el color de marca, siguen siendo bloques de panel
  // oscuro sólidos en ambos modos).
  darkMode: 'class',
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
        stone,
        line,
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
