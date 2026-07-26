import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, FileText, ArrowRight } from 'lucide-react'
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid'
import { GlowCard } from '@/components/ui/GlowCard'
import { CardContent } from '@/components/ui/Card'
import { SectionHeading } from './components/SectionHeading'
import { staggerContainer, staggerItem, sectionReveal } from '@/lib/motion'
import { publicAPI } from '@/api/endpoints'
import {
  ESCRITOS_CONTENT,
  ESCRITOS_CATEGORY_LABELS,
  ESCRITOS_QUERY_KEY,
  mergeEscritosContent,
} from './escritosContent'

// Categorías fijas por diseño (ver escritosContent.js): agregar una
// categoría nueva sigue siendo un cambio de código acá, el Sheet solo
// gestiona los items dentro de las categorías existentes.
const CATEGORIES = Object.keys(ESCRITOS_CONTENT)

export default function Escritos() {
  const [category, setCategory] = useState(CATEGORIES[0])
  const { data: byCategory } = useQuery({
    queryKey: ESCRITOS_QUERY_KEY,
    queryFn: () => publicAPI.getEscritos(),
    staleTime: 5 * 60 * 1000,
  })

  const items = mergeEscritosContent(byCategory)[category]
  const CategoryIcon = category === 'literarios' ? BookOpen : FileText

  return (
    <div className="min-h-screen py-20 sm:py-28">
      <motion.section className="max-w-6xl mx-auto px-4 sm:px-6" {...sectionReveal}>
        {/* Header con fondo propio (gradiente sutil, no toda la sección):
            agrupa título + selector como una unidad con presencia propia,
            en vez de flotar sobre el mismo fondo plano de toda la página. */}
        <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 pb-12 mb-4 border-b border-primary-900/10 bg-gradient-to-b from-primary-50/60 via-primary-50/20 to-transparent">
          <div className="mb-12">
            <SectionHeading label="Colección" align="center">Escritos</SectionHeading>
            <p className="text-stone-600 mt-3 text-center">
              Poesía y reflexiones clínicas, publicadas a medida que están listas.
            </p>
          </div>

          {/* Category toggle: generado desde ESCRITOS_CATEGORY_LABELS, no
              hardcodeado — agregar una categoría nueva en escritosContent.js
              (ej. "cuentos") la hace aparecer acá solo con eso. Segmented
              control con "pill" deslizante compartiendo layoutId: Framer
              Motion anima la transición de posición entre botones solo. */}
          <div className="flex justify-center">
            <div className="inline-flex bg-primary-50 rounded-xl p-1 gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    category === cat ? 'text-white' : 'text-primary-700 hover:text-primary-800'
                  }`}
                >
                  {category === cat && (
                    <motion.div
                      layoutId="escritos-tab-pill"
                      className="absolute inset-0 bg-primary-600 rounded-lg"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{ESCRITOS_CATEGORY_LABELS[cat] ?? cat}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of articles: animate on mount (keyed by category) en vez de
            whileInView — el contenido cambia con estado local al cambiar de
            categoría, no con scroll, y whileInView+viewport once:true nunca
            vuelve a animar tarjetas montadas después del primer reveal
            (quedan en opacity:0 para siempre). La key fuerza un remount
            limpio en cada cambio, así la animación de entrada se repite y
            el cambio de categoría se nota. */}
        <motion.div
          key={category}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <BentoGrid>
            {items.map((item, i) => {
              const isReadable = !item.comingSoon && !!item.docUrl
              const card = (
                <GlowCard className="h-full border-transparent hover:border-primary-200 transition-colors duration-300">
                  <CardContent className="p-7 h-full flex flex-col">
                    <h3 className="inline-flex items-center gap-2 font-display text-xl font-medium text-stone-900 mb-3">
                      <CategoryIcon size={16} className="text-accent-600 shrink-0" />
                      {item.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed flex-1">
                      {item.excerpt}
                    </p>
                    {item.comingSoon && (
                      <div className="mt-6 inline-flex">
                        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-700 bg-accent-50 rounded-full">
                          Próximamente
                        </span>
                      </div>
                    )}
                    {isReadable && (
                      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary-700">
                        Leer <ArrowRight size={14} />
                      </span>
                    )}
                  </CardContent>
                </GlowCard>
              )
              return (
                <BentoCard key={item.title}>
                  <motion.div
                    variants={staggerItem}
                    className="h-full"
                    whileHover={{ y: -6, scale: 1.015, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    {isReadable ? (
                      <Link to={`/escritos/${item.slug}`} className="block h-full">
                        {card}
                      </Link>
                    ) : (
                      card
                    )}
                  </motion.div>
                </BentoCard>
              )
            })}
          </BentoGrid>
        </motion.div>
      </motion.section>
    </div>
  )
}
