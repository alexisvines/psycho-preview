import { useParams, Link, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, FileText } from 'lucide-react'
import { sectionReveal } from '@/lib/motion'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { publicAPI } from '@/api/endpoints'
import { ESCRITOS_QUERY_KEY, ESCRITOS_CATEGORY_LABELS, mergeEscritosContent, findEscritoBySlug } from './escritosContent'

// El texto exportado del Doc es plano, sin marcado — pero Felipe ya usa dos
// convenciones visuales consistentes al escribir: una línea de guiones bajos
// como separador de sección, y líneas cortas en mayúsculas como subtítulo
// ("CANTO I: EL RÍO ESTÁTICO"). Detectarlas acá evita que se vean como texto
// perdido y les da su propio tratamiento tipográfico.
const isDivider = (line) => /^[_*-]{3,}$/.test(line)
const isSectionHeading = (line) => line.length <= 70 && !/[a-zà-ÿ]/.test(line)

// Parser línea por línea en vez de split por bloque separado por línea en
// blanco: el Doc no es consistente con el espaciado alrededor de
// separadores/subtítulos (a veces quedan pegados al verso anterior con un
// solo salto de línea), así que hay que detectarlos por línea individual,
// no asumiendo que siempre van aislados en su propio párrafo.
function parseEscritoBlocks(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let buffer = []
  const flush = () => {
    if (buffer.length > 0) {
      blocks.push({ type: 'paragraph', content: buffer.join('\n') })
      buffer = []
    }
  }
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flush()
      continue
    }
    if (isDivider(line)) {
      flush()
      blocks.push({ type: 'divider' })
      continue
    }
    if (isSectionHeading(line)) {
      flush()
      blocks.push({ type: 'heading', content: line })
      continue
    }
    buffer.push(line)
  }
  flush()
  return blocks
}

// "libro" (literarios): letra capital en el primer párrafo real, texto
// justificado suelto, separadores ornamentales — aire editorial/poético.
function LibroParagraph({ paragraph, isFirst }) {
  if (!isFirst) {
    // clear-both: sin esto, este párrafo (y todo lo que venga después del
    // párrafo con letra capital) sigue acomodándose alrededor del float de
    // la letra en vez de quedar debajo, limpio.
    return (
      <p className="font-display text-lg text-stone-800 leading-loose text-justify mb-6 whitespace-pre-line clear-both">
        {paragraph}
      </p>
    )
  }
  const firstChar = paragraph.charAt(0)
  const rest = paragraph.slice(1)
  return (
    <p className="font-display text-lg text-stone-800 leading-loose text-justify mb-6 whitespace-pre-line">
      <span className="float-left text-6xl sm:text-8xl font-display leading-[0.8] pr-2 pt-1 text-primary-700">
        {firstChar}
      </span>
      {rest}
    </p>
  )
}

// "paper" (psicoanaliticos): sobrio, denso, sin ornamento — convención de
// ensayo/paper académico en vez de manuscrito literario. Sans-serif en vez
// de la serif editorial del poema, para leerse como documento profesional
// contemporáneo en vez de manuscrito.
function PaperParagraph({ paragraph }) {
  return (
    <p className="font-sans text-lg text-stone-800 leading-relaxed text-justify mb-6 whitespace-pre-line">
      {paragraph}
    </p>
  )
}

function EscritoBody({ text, category, excerpt }) {
  const isLibro = category === 'literarios'
  const blocks = parseEscritoBlocks(text)
  const firstParagraphIndex = blocks.findIndex((b) => b.type === 'paragraph')
  let headingCount = 0

  return (
    <div>
      {!isLibro && excerpt && (
        <p className="font-sans border-l-2 border-accent-300 pl-4 italic text-stone-600 text-sm leading-relaxed mb-10">
          {excerpt}
        </p>
      )}

      {blocks.map((block, i) => {
        if (block.type === 'divider') {
          return isLibro ? (
            <div key={i} className="clear-both text-center text-accent-500 text-xs tracking-[0.5em] my-10">
              ✦ ✦ ✦
            </div>
          ) : (
            <hr key={i} className="clear-both my-10 border-t border-stone-300 w-12 mx-auto" />
          )
        }
        if (block.type === 'heading') {
          // Numeración automática de secciones para "paper" — Felipe no
          // escribe el número en el Doc, se cuenta el orden real de
          // aparición de los subtítulos detectados.
          if (!isLibro) headingCount += 1
          return (
            <h2
              key={i}
              className={
                isLibro
                  ? 'clear-both text-center text-xs font-semibold uppercase tracking-[0.2em] text-accent-700 mt-12 mb-6 first:mt-0'
                  : 'clear-both font-sans text-left text-sm font-bold text-stone-900 mt-10 mb-4 first:mt-0'
              }
            >
              {isLibro ? block.content : `${headingCount}. ${block.content}`}
            </h2>
          )
        }
        return isLibro ? (
          <LibroParagraph key={i} paragraph={block.content} isFirst={i === firstParagraphIndex} />
        ) : (
          <PaperParagraph key={i} paragraph={block.content} />
        )
      })}
    </div>
  )
}

export default function EscritoDetail() {
  const { slug } = useParams()
  const { data: byCategory, isLoading: isLoadingList } = useQuery({
    queryKey: ESCRITOS_QUERY_KEY,
    queryFn: () => publicAPI.getEscritos(),
    staleTime: 5 * 60 * 1000,
  })

  const found = byCategory !== undefined ? findEscritoBySlug(mergeEscritosContent(byCategory), slug) : null

  const { data: text, isLoading: isLoadingText } = useQuery({
    queryKey: ['escrito-doc-text', found?.item?.docUrl],
    queryFn: () => publicAPI.getEscritoDocText(found.item.docUrl),
    enabled: !!found?.item?.docUrl,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoadingList) return null

  // Escrito inexistente, aún "Próximamente", o sin docUrl: no hay nada que
  // leer en esta ruta, redirige al listado en vez de mostrar una página vacía.
  if (!found || found.item.comingSoon || !found.item.docUrl) {
    return <Navigate to="/escritos" replace />
  }

  const { item, category } = found
  const isLibro = category === 'literarios'
  const CategoryIcon = isLibro ? BookOpen : FileText

  // 200 palabras/min es la estimación estándar de velocidad de lectura —
  // solo tiene sentido mostrarlo en "paper" (señal de rigor de un
  // artículo), no en el poema. Cálculo directo (no hook): ya estamos
  // después de los returns condicionales, así que un useMemo acá violaría
  // las Rules of Hooks; el cálculo es barato, no necesita memoización.
  const readingMinutes =
    !isLibro && text ? Math.max(1, Math.round(text.trim().split(/\s+/).length / 200)) : null

  return (
    <div className="min-h-screen py-20 sm:py-28 px-4 sm:px-6">
      <motion.section className="max-w-2xl mx-auto" {...sectionReveal}>
        <Link
          to="/escritos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Volver a Escritos
        </Link>

        {/* "Hoja": misma superficie base y misma técnica de sombra
            ambiental (por capas, no shadow-card plano) para ambas
            variantes — da sensación de página elevada físicamente sobre el
            fondo. La diferencia entre libro y paper es solo textura/ícono/
            barra de membrete, no el color de fondo ni el tipo de sombra
            (un intento anterior con fondo distinto + gradiente de "lomo"
            se veía como una mancha, no como profundidad real). */}
        <div
          className={
            isLibro
              ? 'relative bg-surface border border-primary-900/10 rounded-xl overflow-hidden px-6 py-12 sm:px-14 sm:py-16 shadow-[0_1px_2px_rgba(23,23,23,0.04),0_8px_24px_-4px_rgba(23,23,23,0.10),0_24px_48px_-12px_rgba(23,23,23,0.12)]'
              : 'relative bg-surface border border-primary-900/10 rounded-lg overflow-hidden px-6 py-12 sm:px-14 sm:py-16 shadow-[0_1px_2px_rgba(23,23,23,0.04),0_8px_24px_-4px_rgba(23,23,23,0.10),0_24px_48px_-12px_rgba(23,23,23,0.12)]'
          }
        >
          {isLibro ? (
            <GrainOverlay opacity={0.05} blend="multiply" />
          ) : (
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-primary-700" />
          )}
          <div className="relative text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent-700 mb-3">
              <CategoryIcon size={14} />
              {ESCRITOS_CATEGORY_LABELS[category] ?? category}
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-medium text-stone-900 leading-tight">
              {item.title}
            </h1>
            {!isLibro && (
              <p className="font-sans text-sm text-stone-500 mt-3">
                Por Felipe Caro Díaz — Psicólogo Clínico
                {readingMinutes && ` · ${readingMinutes} min de lectura`}
              </p>
            )}
          </div>

          <div className="relative">
            {isLoadingText && (
              <p className="text-stone-500 text-sm text-center">Cargando texto…</p>
            )}

            {!isLoadingText && !text && (
              <p className="text-stone-500 text-sm text-center">
                No se pudo cargar el texto en este momento. Intenta recargar la página.
              </p>
            )}

            {!isLoadingText && text && (
              <EscritoBody text={text} category={category} excerpt={item.excerpt} />
            )}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
