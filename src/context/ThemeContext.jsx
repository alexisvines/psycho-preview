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

export function ThemeProvider({ children }) {
  const [palette, setPalette] = useState(() => localStorage.getItem('demo-palette') || 'current')
  const [logoVariant, setLogoVariant] = useState(() => localStorage.getItem('demo-logo') || 'cuenco')

  useEffect(() => {
    document.documentElement.setAttribute('data-palette', palette)
    localStorage.setItem('demo-palette', palette)
  }, [palette])

  useEffect(() => {
    localStorage.setItem('demo-logo', logoVariant)
  }, [logoVariant])

  return (
    <ThemeContext.Provider value={{ palette, setPalette, logoVariant, setLogoVariant }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
