import { useState } from 'react'
import { motion } from 'framer-motion'
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid'
import { GlowCard } from '@/components/ui/GlowCard'
import { CardContent } from '@/components/ui/Card'
import { SectionHeading } from './components/SectionHeading'
import { staggerContainer, staggerItem, sectionReveal } from '@/lib/motion'
import { ESCRITOS_CONTENT, ESCRITOS_CATEGORY_LABELS } from './escritosContent'

const CATEGORIES = Object.keys(ESCRITOS_CONTENT)

export default function Escritos() {
  const [category, setCategory] = useState(CATEGORIES[0])

  const items = ESCRITOS_CONTENT[category]

  return (
    <div className="min-h-screen py-20 sm:py-28">
      <motion.section className="max-w-6xl mx-auto px-4 sm:px-6" {...sectionReveal}>
        <div className="mb-12">
          <SectionHeading align="center">Escritos</SectionHeading>
        </div>

        {/* Category toggle: generado desde ESCRITOS_CATEGORY_LABELS, no
            hardcodeado — agregar una categoría nueva en escritosContent.js
            (ej. "cuentos") la hace aparecer acá solo con eso. */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              }`}
            >
              {ESCRITOS_CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
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
            {items.map((item) => (
              <BentoCard key={item.id}>
                <motion.div
                  variants={staggerItem}
                  className="h-full"
                  whileHover={{ y: -6, scale: 1.015, rotate: item.id % 2 === 0 ? -0.4 : 0.4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <GlowCard className="h-full border-transparent hover:border-primary-200 transition-colors duration-300">
                    <CardContent className="p-7 h-full flex flex-col">
                      <h3 className="font-display text-xl font-medium text-stone-900 mb-3">
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
                    </CardContent>
                  </GlowCard>
                </motion.div>
              </BentoCard>
            ))}
          </BentoGrid>
        </motion.div>
      </motion.section>
    </div>
  )
}
