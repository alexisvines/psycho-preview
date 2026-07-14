import { motion, useReducedMotion } from 'framer-motion'

// Marca de Felipe Caro: tesseracto (cubo dentro de un cubo, visto de frente
// como un "túnel") en wireframe, diseño y colores exactos del logo que
// Felipe encargó y aprobó — no una reinterpretación. Reemplaza al wordmark
// de firma "FeCarD", que mezclaba su registro de poeta con el de psicólogo
// clínico. Segunda versión (2026-07-13): la primera era un cubo isométrico
// en hexágono — comparado lado a lado con el original de Felipe, esta
// vista frontal con caras trapezoidales calza mucho mejor.
//
// Animación de entrada (única interacción de firma del sitio): el mark se
// "dibuja" con stroke-draw real (prop `pathLength` de framer-motion, 0→1)
// al montar — no hay JS de scroll ni layout thrash, es GPU-only (opacity +
// el truco de stroke-dasharray). Respeta prefers-reduced-motion — sin él,
// todo aparece ya trazado.
// Sombra de contacto: drop-shadow real (sigue el contorno del trazo, no una
// caja como box-shadow), mismo sistema que shadow-card/shadow-button
// (tailwind.config.js), aplicado acá al glifo en vez de a un contenedor.
const CONTACT_SHADOW = 'drop-shadow-[0_1px_1.5px_rgba(23,32,42,0.22)]'

export function BrandMark({ size = 36, className = '', interactive = false }) {
  const shouldReduceMotion = useReducedMotion()
  // Bajo ~24px el detalle del tesseracto se pierde: cae a una forma reducida.
  const tiny = size < 24

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${CONTACT_SHADOW} ${interactive ? 'transition-opacity duration-300 ease-out group-hover:opacity-80' : ''} ${className}`}
    >
      <TesseractMark tiny={tiny} reduce={shouldReduceMotion} />
    </svg>
  )
}

// Transición estándar de trazo del mark.
const DRAW = { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
const drawProps = (reduce, delay = 0) => ({
  initial: reduce ? false : { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { ...DRAW, delay },
})
const popProps = (reduce, delay = 0) => ({
  initial: reduce ? false : { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35, ease: 'easeOut', delay },
})

const STROKE = '#5B8FC7'
const TEAL = '#A9E9E2'
const PINK = '#D9A9D6'
const PURPLE = '#BFAEEC'
const BLUE = '#9FCBEE'

// Caras: cubo exterior (4, incluida la frontal translúcida) + cubo interior
// (mismas 4), en el mismo orden top/derecha/abajo/frente para que ambos
// cubos se lean como el mismo objeto visto "por dentro".
const FACES = [
  { d: 'M 30,55 L 100,55 L 135,25 L 65,25 Z', fill: TEAL, opacity: 0.8 },
  { d: 'M 100,55 L 135,25 L 135,95 L 100,125 Z', fill: PINK, opacity: 0.8 },
  { d: 'M 30,125 L 100,125 L 135,95 L 65,95 Z', fill: PURPLE, opacity: 0.8 },
  { d: 'M 30,55 L 100,55 L 100,125 L 30,125 Z', fill: BLUE, opacity: 0.45 },
  { d: 'M 58.9,66 L 90.4,66 L 106.1,52.5 L 74.6,52.5 Z', fill: TEAL, opacity: 0.8 },
  { d: 'M 90.4,66 L 106.1,52.5 L 106.1,84 L 90.4,97.5 Z', fill: PINK, opacity: 0.8 },
  { d: 'M 58.9,97.5 L 90.4,97.5 L 106.1,84 L 74.6,84 Z', fill: PURPLE, opacity: 0.8 },
  { d: 'M 58.9,66 L 90.4,66 L 90.4,97.5 L 58.9,97.5 Z', fill: BLUE, opacity: 0.45 },
]

// Aristas: cuadrado exterior + cuadrado "de fuga" exterior + sus 4
// conectores en diagonal, luego lo mismo para el cubo interior — 32 en
// total, dibujadas en secuencia (delay creciente) para el efecto de
// "ensamblado".
const EDGES = [
  // cuadrado frontal exterior
  'M 30,55 L 100,55', 'M 100,55 L 100,125', 'M 100,125 L 30,125', 'M 30,125 L 30,55',
  // cuadrado de fuga exterior
  'M 65,25 L 135,25', 'M 135,25 L 135,95', 'M 135,95 L 65,95', 'M 65,95 L 65,25',
  // conectores exteriores
  'M 30,55 L 65,25', 'M 100,55 L 135,25', 'M 100,125 L 135,95', 'M 30,125 L 65,95',
  // conectores al cubo interior
  'M 30,55 L 58.9,66', 'M 65,25 L 74.6,52.5', 'M 100,55 L 90.4,66', 'M 135,25 L 106.1,52.5',
  'M 100,125 L 90.4,97.5', 'M 135,95 L 106.1,84', 'M 30,125 L 58.9,97.5', 'M 65,95 L 74.6,84',
  // cuadrado frontal interior
  'M 58.9,66 L 90.4,66', 'M 90.4,66 L 90.4,97.5', 'M 90.4,97.5 L 58.9,97.5', 'M 58.9,97.5 L 58.9,66',
  // cuadrado de fuga interior
  'M 74.6,52.5 L 106.1,52.5', 'M 106.1,52.5 L 106.1,84', 'M 106.1,84 L 74.6,84', 'M 74.6,84 L 74.6,52.5',
  // conectores interiores
  'M 58.9,66 L 74.6,52.5', 'M 90.4,66 L 106.1,52.5', 'M 90.4,97.5 L 106.1,84', 'M 58.9,97.5 L 74.6,84',
]

function TesseractMark({ tiny, reduce }) {
  if (tiny) {
    // Versión simplificada para tamaños pequeños: solo el cuadrado frontal
    // exterior (el detalle del tesseracto completo se pierde a este tamaño).
    return (
      <motion.path
        d="M 30,55 L 100,55 L 100,125 L 30,125 Z"
        stroke={STROKE}
        strokeWidth={8}
        strokeLinejoin="round"
        fill={TEAL}
        fillOpacity={0.75}
        {...drawProps(reduce)}
      />
    )
  }

  return (
    <>
      {FACES.map((f, i) => (
        <motion.path key={i} d={f.d} fill={f.fill} fillOpacity={f.opacity} {...popProps(reduce, 0.65 + i * 0.05)} />
      ))}
      {EDGES.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={STROKE}
          strokeWidth={3}
          strokeLinecap="round"
          {...drawProps(reduce, i * 0.018)}
        />
      ))}
    </>
  )
}
