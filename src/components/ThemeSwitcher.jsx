import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Palette, X } from 'lucide-react'
import { useTheme, PALETTES, LOGOS } from '@/context/ThemeContext'
import { dropdownVariants } from '@/lib/motion'

// Widget SOLO de este repo de vista previa (no existe en el proyecto real):
// deja que Felipe/Alexis prueben logo + paleta directo sobre el diseño real,
// sin páginas de comparación aparte. Vive como un ícono discreto bajo el
// header (no un pill flotante abajo con texto) para que no compita
// visualmente con el sitio ni choque con el CTA sticky del wizard de
// reserva en mobile — es una herramienta de trabajo, no parte del producto.
export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const { palette, setPalette, logoVariant, setLogoVariant } = useTheme()

  return (
    <div className="fixed top-[4.75rem] right-3 sm:right-4 z-50 print:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/70 bg-surface/70 text-stone-500 shadow-sm backdrop-blur-md transition-colors hover:text-primary-700 dark:hover:text-primary-300 hover:bg-surface"
        aria-label="Herramienta de vista previa: probar logo y paleta"
        aria-expanded={open}
        title="Probar diseños (solo vista previa)"
      >
        {open ? <X size={15} /> : <Palette size={15} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-stone-200 bg-surface shadow-card-hover p-4"
          >
            <span className="block text-sm font-semibold text-stone-900 mb-3">Vista previa de diseño</span>

            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1.5">
              Logo
            </label>
            <select
              value={logoVariant}
              onChange={(e) => setLogoVariant(e.target.value)}
              className="w-full mb-4 px-3 py-2 text-sm border border-stone-200 rounded-lg bg-cream-50 text-stone-900 focus-visible:ring-2 focus-visible:ring-primary-500"
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
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-cream-50 text-stone-900 focus-visible:ring-2 focus-visible:ring-primary-500"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
