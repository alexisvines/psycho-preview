import { motion, useReducedMotion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import { sectionReveal } from '@/lib/motion'
import { SectionHeading } from './SectionHeading'

// Ficha de Google Maps del consultorio (enlazada desde el badge de
// calificación); apunta a la vista pública de reseñas.
const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/place/Consultorio+Felipe+Caro+D%C3%ADaz,+psic%C3%B3logo+cl%C3%ADnico/@-33.5956188,-71.6106921,17z/data=!4m8!3m7!1s0x96623855da1ac817:0x2ffa2e97ea353826!8m2!3d-33.5956188!4d-71.6106921!9m1!1b1!16s%2Fg%2F11c2jtvp8g'

/**
 * Parsea el body del bloque CMS `testimonials`: una reseña por línea con el
 * formato "Nombre — texto" (mismo separador " — " usado por `services`).
 * Líneas vacías o sin el separador se ignoran en silencio en vez de romper
 * el render — el copy del CMS puede venir mal formado y la sección debe
 * seguir siendo útil con lo que sí se pudo parsear.
 */
export function parseTestimonials(body) {
  return (body ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(' — ')
      if (separatorIndex === -1) return null
      const name = line.slice(0, separatorIndex).trim()
      const text = line.slice(separatorIndex + 3).trim()
      if (!name || !text) return null
      return { name, text }
    })
    .filter(Boolean)
}

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-amber-500" strokeWidth={0} />
      ))}
    </div>
  )
}

function TestimonialCard({ name, text }) {
  return (
    <figure className="w-[290px] sm:w-[360px] shrink-0 rounded-3xl border border-stone-200/70 bg-surface/95 px-6 py-6 shadow-card">
      <Stars />
      <blockquote className="mt-3 font-display italic text-[15px] sm:text-base text-stone-700 leading-relaxed">
        “{text}”
      </blockquote>
      <figcaption className="mt-4 text-sm font-semibold text-stone-900 not-italic">{name}</figcaption>
    </figure>
  )
}

function MarqueeRow({ items, duration, reverse }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <div className="flex gap-5 overflow-x-auto pb-2 px-4 sm:px-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        {items.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    )
  }

  // Contenido duplicado para que el loop sea perfectamente continuo: al
  // recorrer -50% del ancho (el primer set completo) volvemos a un punto
  // visualmente idéntico al inicio.
  const track = [...items, ...items]

  return (
    <div className="testimonials-row overflow-hidden">
      <div
        className="testimonials-track flex w-max gap-5"
        style={{
          animation: `${reverse ? 'testimonials-marquee-reverse' : 'testimonials-marquee'} ${duration}s linear infinite`,
        }}
      >
        {track.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </div>
  )
}

/**
 * Sección de reseñas: dos filas en marquee horizontal infinito, deslizando
 * en direcciones opuestas, muy lento (sensación atmosférica, no "ticker" de
 * noticias). Pausa al hover vía CSS puro. Con prefers-reduced-motion cae a
 * dos filas estáticas con scroll horizontal nativo.
 */
export default function TestimonialsMarquee({ title, body }) {
  const testimonials = parseTestimonials(body)
  if (testimonials.length === 0) return null

  const half = Math.ceil(testimonials.length / 2)
  const rowA = testimonials.slice(0, half)
  const rowB = testimonials.slice(half).length > 0 ? testimonials.slice(half) : testimonials

  return (
    <motion.section
      id="testimonios"
      className="relative overflow-hidden bg-cream border-y border-stone-200/60 py-20 sm:py-24 scroll-mt-20"
      {...sectionReveal}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <SectionHeading label="Testimonios" align="center">{title}</SectionHeading>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex flex-col items-center gap-1.5"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800 transition-colors group-hover:bg-amber-100">
              <Star size={14} className="fill-amber-500" strokeWidth={0} />
              5,0 · 44 reseñas en Google
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-stone-500 transition-colors group-hover:text-primary-700 dark:group-hover:text-primary-300">
              Ver todas las reseñas <ExternalLink size={12} />
            </span>
          </a>
        </div>
      </div>

      <div className="relative space-y-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-40 bg-gradient-to-r from-cream to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-40 bg-gradient-to-l from-cream to-transparent" />
        <MarqueeRow items={rowA} duration={52} />
        <MarqueeRow items={rowB} duration={44} reverse />
      </div>

      <style>{`
        @keyframes testimonials-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes testimonials-marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .testimonials-row:hover .testimonials-track {
          animation-play-state: paused;
        }
      `}</style>
    </motion.section>
  )
}
