import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { sectionReveal } from '@/lib/motion'
import { SectionHeading, SectionLabel } from './SectionHeading'
import { Button } from '@/components/ui/Button'

const SEPARATOR = ' — '

/**
 * Parsea el body del bloque CMS `approach`: mismo formato "Título — texto"
 * de las demás secciones (evidence/services/testimonials). Tolerante:
 * líneas vacías o sin separador se ignoran en silencio.
 */
export function parseApproachItems(body) {
  return (body ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(SEPARATOR)
      if (separatorIndex === -1) return null
      const title = line.slice(0, separatorIndex).trim()
      const text = line.slice(separatorIndex + SEPARATOR.length).trim()
      if (!title || !text) return null
      return { title, text }
    })
    .filter(Boolean)
}

/**
 * "¿Qué es el psicoanálisis?": sección editorial entre "El espacio" y
 * "Evidencia" — conocer a Felipe → entender su enfoque → ver la evidencia.
 * El primer ítem hace de intro destacada (texto grande, título en Fraunces);
 * el último es el puente a la conversión (card cálida, borde terracota, CTA).
 */
export default function ApproachSection({ title, body }) {
  const items = parseApproachItems(body)
  if (items.length === 0) return null

  const [intro, ...rest] = items
  const closing = rest.length > 0 ? rest[rest.length - 1] : null
  const middle = closing ? rest.slice(0, -1) : rest

  return (
    // Segundo bloque de color real de la página (el primero es el panel del
    // hero): esta es la sección de tesis del sitio ("¿qué es el
    // psicoanálisis?"), merece el peso visual de un fondo oscuro real, no
    // otro tramo de papel casi blanco.
    <motion.section
      id="psicoanalisis"
      className="relative bg-primary-900 scroll-mt-20"
      {...sectionReveal}
    >
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <SectionLabel>El enfoque</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-cream-50 leading-[1.1] tracking-tight mb-10">
          {title}
        </h2>

        {/* Panel elevado: antes intro + columnas flotaban directo sobre el
            primary-900 (todo al mismo plano, "se difumina" — feedback de
            Alexis). Un tono más claro que el fondo + borde + sombra le da
            una capa real, la misma lógica de "escalera de superficies" que
            usan las cards claras del resto del sitio, adaptada a fondo
            oscuro (bg-primary-800 en vez de bg-surface). */}
        <motion.div
          className="rounded-2xl bg-primary-800 border border-white/10 shadow-lifted p-7 sm:p-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Intro destacada: el título del bloque CMS va como run-in heading
              (arranque en Newsreader itálica dentro del párrafo lead) — evita
              apilar un tercer nivel de título bajo el eyebrow y el h2. */}
          {intro && (
            <div className="max-w-3xl mb-10">
              <p className="text-lg sm:text-xl text-primary-200 leading-relaxed">
                <span className="font-display italic text-2xl sm:text-[1.65rem] text-cream-50 mr-2">
                  {intro.title}.
                </span>
                {intro.text}
              </p>
            </div>
          )}

          {/* Bloques intermedios: jerarquía secundaria, dos columnas en desktop */}
          {middle.length > 0 && (
            <div className={`grid sm:grid-cols-2 gap-y-8 ${middle.length === 2 ? 'gap-x-0' : 'gap-x-10'}`}>
              {middle.map((item, i) => (
                <div
                  key={item.title}
                  // Con exactamente dos columnas, un divisor vertical sutil
                  // hace intencional la diferencia de largo entre ambas.
                  className={
                    middle.length === 2
                      ? i === 0
                        ? 'sm:pr-10'
                        : 'sm:pl-10 sm:border-l sm:border-white/12'
                      : ''
                  }
                >
                  <h4 className="font-display text-lg font-semibold text-cream-50 mb-2">{item.title}</h4>
                  <p className="text-primary-200 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="h-14 sm:h-16" aria-hidden="true" />

        {/* Puente a la conversión: card clara sobre el fondo oscuro — sigue
            siendo el único contenedor con borde de acento de toda la página.
            Antes era solo texto gris parejo sin ancla visual ("tosco" —
            feedback de Alexis); ahora tiene: ícono de orientación (calza con
            "Felipe te orienta hacia la alternativa adecuada"), etiqueta de
            contexto, y la frase clave del texto resaltada en color en vez de
            todo al mismo peso. */}
        {closing && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-accent-400/50 bg-surface p-7 sm:p-9 shadow-lifted"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600 ring-1 ring-accent-200">
                    <Compass size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-accent-600 mb-2">
                      ¿Tienes dudas sobre el enfoque?
                    </span>
                    <h4 className="font-display text-xl sm:text-2xl font-semibold text-stone-900 mb-2">
                      {closing.title}
                    </h4>
                    <p className="text-stone-700 leading-relaxed max-w-xl">
                      {closing.text.split('. ').map((sentence, i, arr) => (
                        <span key={i} className={i === 0 ? 'text-stone-900 font-medium' : ''}>
                          {sentence}
                          {i < arr.length - 1 ? '. ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/reservar" className="shrink-0 sm:pl-2">
                <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
                  Reservar primera consulta <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
