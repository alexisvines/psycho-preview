/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      },
      colors: {
        // "Salvia y arena": escala verde salvia cálida (reemplaza el teal
        // anterior). Anclas de diseño: 500 ≈ #6B7F5E (tono base), 700 ≈
        // #4A5D42 (CTAs, texto sobre crema), 950 verde-marrón muy oscuro y
        // cálido (footer) — nunca un verde-negro frío.
        primary: {
          50: '#f6f7f1',
          100: '#eaeee1',
          200: '#d5dcc3',
          300: '#b7c49e',
          400: '#94a878',
          500: '#6b7f5e',
          600: '#586b4c',
          700: '#4a5d42',
          800: '#3b4a35',
          900: '#2f3b2a',
          950: '#1c2318',
        },
        // Terracota: acento cálido para pull-stats, detalles de énfasis y
        // el borde de la card "puente a conversión" de la sección de enfoque.
        accent: {
          50: '#fbf2ec',
          100: '#f6e2d3',
          200: '#edc5a8',
          300: '#e1a379',
          400: '#d38e5f',
          500: '#c4764a',
          600: '#a85f39',
          700: '#87492c',
          800: '#6b3922',
          900: '#57301d',
          950: '#2e180e',
        },
        // Crema base unificado: reemplaza los hex sueltos (#fbf7f0, #faf5ec…)
        // repetidos en Landing/TestimonialsMarquee/EvidenceSection.
        cream: {
          DEFAULT: '#faf6ef',
          50: '#faf6ef',
          100: '#f3ede2',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#0ea5e9',
      },
      boxShadow: {
        card: '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.05)',
        'card-hover': '0 2px 4px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.08)',
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
