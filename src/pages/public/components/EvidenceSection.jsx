import { motion } from 'framer-motion'
import { sectionReveal } from '@/lib/motion'
import { SectionHeading } from './SectionHeading'
import { WatercolorWash } from '@/components/ui/WatercolorWash'

const SEPARATOR = ' — '
// Cita de fuente, appendeada al final del texto entre paréntesis:
// "... es cuidarse. (Fuente: OMS — Informe Mundial de Salud Mental, 2022)"
const SOURCE_REGEX = /\s*\(Fuente:\s*([^)]+)\)\s*$/i

/**
 * Parsea el body del bloque CMS `evidence`: un ítem por línea con el mismo
 * formato "Título — texto" usado por `services`/`testimonials`. Líneas
 * vacías o sin separador se ignoran en silencio, igual que en esos parsers.
 * Si el texto trae una cita "(Fuente: ...)" al final, se extrae a `source`
 * y se retira del texto visible — así nunca se ve el paréntesis crudo,
 * se use o no la fuente en el layout (p.ej. en un bloque de texto simple).
 */
export function parseEvidenceItems(body) {
  return (body ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(SEPARATOR)
      if (separatorIndex === -1) return null
      const title = line.slice(0, separatorIndex).trim()
      let text = line.slice(separatorIndex + SEPARATOR.length).trim()
      if (!title || !text) return null
      const sourceMatch = text.match(SOURCE_REGEX)
      const source = sourceMatch ? sourceMatch[1].trim() : null
      if (sourceMatch) text = text.slice(0, sourceMatch.index).trim()
      return { title, text, source }
    })
    .filter(Boolean)
}

// Detecta si un ítem tiene un "número protagonista" apto para mostrarse como
// pull-stat gigante: dígito o "%" al inicio del título ("1 de cada 8"), o un
// porcentaje / proporción dentro del texto ("...mejor que el 80% de...").
// Heurística deliberadamente laxa: el copy es editable desde el CMS, así
// que el layout debe poder degradar en vez de romperse si Felipe cambia
// las cifras o el orden.
function extractStat(item) {
  if (/^\d/.test(item.title) || item.title.includes('%')) return item.title
  const match = item.text.match(/\d{1,3}%|\d+\s+de\s+\d+/i)
  return match ? match[0] : null
}

/**
 * Clasifica los ítems parseados en hasta 2 "pull stats" (número gigante +
 * fuente, ya extraída por `parseEvidenceItems`) y el resto como bloques de
 * texto editorial. El layout asimétrico (2 stats + 2 bloques) solo se
 * activa si se detectan al menos 2 stats; si no, todos los ítems degradan
 * a bloques de texto simples — nunca un stat a medias o "huérfano".
 */
export function classifyEvidenceItems(items) {
  const stats = []
  const textBlocks = []
  for (const item of items) {
    const statValue = stats.length < 2 ? extractStat(item) : null
    if (statValue) {
      stats.push({ ...item, stat: statValue })
    } else {
      textBlocks.push(item)
    }
  }
  if (stats.length < 2) {
    return { stats: [], textBlocks: items }
  }
  return { stats, textBlocks }
}

function PullStat({ stat, title, text, source }) {
  return (
    <div>
      <p className="font-display text-6xl sm:text-7xl font-medium text-accent-600 leading-none tracking-tight">
        {stat}
      </p>
      <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xs">
        {stat === title ? text : `${title}. ${text}`}
      </p>
      {source && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          {source}
        </p>
      )}
    </div>
  )
}

function TextBlock({ title, text }) {
  return (
    <div className="max-w-sm">
      <h3 className="font-display text-xl sm:text-2xl font-medium text-stone-900 mb-2">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{text}</p>
    </div>
  )
}

/**
 * "¿Por qué consultar?": composición editorial asimétrica sobre un fondo
 * cálido que contrasta suavemente con las secciones vecinas. Dos pull-stats
 * gigantes (tono esperanzador, no alarmista) más dos bloques de texto,
 * nunca cuatro cards iguales.
 */
export default function EvidenceSection({ title, body }) {
  const items = parseEvidenceItems(body)
  if (items.length === 0) return null

  const { stats, textBlocks } = classifyEvidenceItems(items)

  return (
    <motion.section
      id="evidencia"
      className="relative bg-gradient-to-b from-primary-50/70 via-cream to-primary-50/40 border-y border-primary-100/70 scroll-mt-20"
      {...sectionReveal}
    >
      <WatercolorWash />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <SectionHeading label="Evidencia" align="center" className="mb-14">
          {title}
        </SectionHeading>

        {stats.length === 2 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-14">
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <PullStat {...stats[0]} />
            </motion.div>
            <motion.div
              className="md:col-span-5 md:mt-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <PullStat {...stats[1]} />
            </motion.div>

            {textBlocks.map((block, i) => (
              <motion.div
                key={block.title}
                className={i === 0 ? 'md:col-span-5 md:col-start-1' : 'md:col-span-6 md:col-start-6'}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.16 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <TextBlock {...block} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
            {items.map((item) => (
              <TextBlock key={item.title} {...item} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  )
}
