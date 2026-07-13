import { useState } from 'react'
import { Palette, X } from 'lucide-react'
import { useTheme, PALETTES, LOGOS } from '@/context/ThemeContext'

// Widget flotante SOLO de este repo de vista previa (no existe en el
// proyecto real): deja que Felipe/Alexis prueben logo + paleta directo
// sobre el diseño real, sin páginas de comparación aparte.
export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const { palette, setPalette, logoVariant, setLogoVariant } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      {open ? (
        <div className="w-72 rounded-2xl border border-stone-200 bg-white shadow-card-hover p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-stone-900">Vista previa de diseño</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1.5">
            Logo
          </label>
          <select
            value={logoVariant}
            onChange={(e) => setLogoVariant(e.target.value)}
            className="w-full mb-4 px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-900 focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {LOGOS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>

          <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1.5">
            Paleta
          </label>
          <select
            value={palette}
            onChange={(e) => setPalette(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-900 focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {PALETTES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <p className="text-xs text-stone-400 mt-3 leading-relaxed">
            Solo visible en esta vista previa — no existe en el sitio real.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-primary-700 text-white pl-3 pr-4 py-2.5 text-sm font-medium shadow-card-hover hover:bg-primary-800 transition-colors"
        >
          <Palette size={16} />
          Probar diseños
        </button>
      )}
    </div>
  )
}
