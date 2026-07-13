import React, { createContext, useContext, useEffect, useState } from 'react'

// Prototipo comparativo en vivo: guarda qué logo y qué paleta están activos
// (persistidos en localStorage para sobrevivir recargas mientras Felipe
// navega entre / y /reservar) y refleja la paleta en document.documentElement
// como [data-palette] — de ahí la leen las variables CSS de src/index.css,
// que a su vez alimentan los colores de Tailwind (ver tailwind.config.js).
export const PALETTES = [
  { id: 'current', label: 'Actual (salvia y terracota)' },
  { id: 'a', label: 'A — Tinta y almagre' },
  { id: 'b', label: 'B — Azul de medianoche y ocre' },
  { id: 'c', label: 'C — Verde botella y burdeo' },
  { id: 'd', label: 'D — Bosque y greda (con cuerpo)' },
  { id: 'e', label: 'E — Medianoche y caldera (con cuerpo)' },
  { id: 'f', label: 'F — Burdeo y lino (con cuerpo)' },
]

// Shortlist curada (2026-07-12): de 12 conceptos evaluados en 3 rondas de
// investigación, estos 5 son los no-redundantes entre sí — el resto eran
// variaciones cercanas de "diálogo entre dos voces" o de "monograma FC"
// ya superadas por el mejor de cada familia. "cuenco" se mantiene como
// referencia del "antes" para que el contraste sea visible.
export const LOGOS = [
  { id: 'cuenco', label: 'Actual — El cuenco que recibe' },
  { id: 'puntoSeguido', label: 'Punto y seguido' },
  { id: 'contencion', label: 'Contención (la C rodea a la F)' },
  { id: 'entrevista', label: 'Entrevista (F y C frente a frente)' },
  { id: 'fecard', label: 'FeCarD (su firma de poeta)' },
]

const ThemeContext = createContext(null)

// Modo claro/oscuro: a diferencia de palette/logo (herramientas de decisión
// de ESTE repo de vista previa), este SÍ es un feature real del sitio.
// Deliberadamente NO sigue prefers-color-scheme del sistema en la primera
// visita — seguirlo hacía que el sitio cargara oscuro para cualquiera con
// el modo oscuro activado en su teléfono, sin que lo haya pedido acá, y
// todo el trabajo editorial (papel crema, fotos en duotono, paleta salvia/
// terracota) vive en el modo claro. Toda visita nueva ve esa versión
// primero; el modo oscuro es un extra que se elige a mano y, una vez
// elegido, queda recordado (persistido) para la próxima visita.
function getInitialMode() {
  const saved = localStorage.getItem('theme-mode')
  return saved === 'dark' ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [palette, setPalette] = useState(() => localStorage.getItem('demo-palette') || 'current')
  const [logoVariant, setLogoVariant] = useState(() => localStorage.getItem('demo-logo') || 'cuenco')
  const [mode, setMode] = useState(getInitialMode)

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette)
    localStorage.setItem('demo-palette', palette)
  }, [palette])

  useEffect(() => {
    localStorage.setItem('demo-logo', logoVariant)
  }, [logoVariant])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    // Clase "dark" en paralelo al atributo: el atributo alimenta las
    // variables CSS (cream/surface/stone/line, ver index.css), la clase
    // habilita los `dark:` puntuales de Tailwind para los pocos casos que
    // necesitan un valor distinto en vez de una inversión automática.
    document.documentElement.classList.toggle('dark', mode === 'dark')
    localStorage.setItem('theme-mode', mode)
  }, [mode])

  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ palette, setPalette, logoVariant, setLogoVariant, mode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
