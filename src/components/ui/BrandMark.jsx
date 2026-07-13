import { motion, useReducedMotion } from 'framer-motion'

// Marca de Felipe Caro — prototipo comparativo en vivo (ThemeSwitcher.jsx).
// Shortlist curada de 5 variantes (de 12 evaluadas en 3 rondas de
// investigación; ver ThemeContext.jsx para el porqué de cada recorte):
//   - cuenco: identidad actual, referencia del "antes"
//   - puntoSeguido: después del punto, la frase sigue
//   - contencion: monograma FC, la C rodea a la F sin cerrarse
//   - entrevista: monograma FC, F y C frente a frente
//   - fecard: wordmark con su firma real de poeta (viewBox propio, ver abajo)
// El color ya no se pasa como hex fijo: lee de --brand-ink/--brand-accent
// (y su par "-negative" para tone="negative"), definidas por paleta en
// src/index.css — así el mark también sigue el selector de paleta activo.
//
// Animación de entrada (única interacción de firma del sitio, no una por
// sección): cada mark se "dibuja" con stroke-draw real (prop `pathLength`
// de framer-motion, 0→1) al montar — no hay JS de scroll ni layout thrash,
// es GPU-only (opacity + el truco de stroke-dasharray). Se dispara cada vez
// que el componente monta: al cargar la página, y en este prototipo también
// al cambiar de variante en el ThemeSwitcher (útil para verla en cada
// opción). Respeta prefers-reduced-motion — sin él, todo aparece ya trazado.
// Sombra de contacto: drop-shadow real (sigue el contorno del trazo, no una
// caja como box-shadow) tintada con la tinta de la paleta activa — mismo
// sistema que shadow-card/shadow-button (tailwind.config.js), aplicado acá
// al glifo en vez de a un contenedor. El glifo se mantiene plano (sin
// bisel/relieve en el trazo mismo, ver discusión con Alexis); esto solo lo
// "despega" un poco de lo que tenga detrás, funciona sobre cualquier fondo
// porque sigue la silueta real, no un rectángulo.
const CONTACT_SHADOW = 'drop-shadow-[0_1px_1.5px_rgb(var(--color-primary-950)/0.22)]'

export function BrandMark({ size = 36, className = '', tone = 'color', interactive = false, variant = 'cuenco' }) {
  const ink = tone === 'negative' ? 'var(--brand-ink-negative)' : 'var(--brand-ink)'
  const accent = tone === 'negative' ? 'var(--brand-accent-negative)' : 'var(--brand-accent)'
  const shouldReduceMotion = useReducedMotion()
  // Bajo ~24px los detalles finos se pierden: cada variante cae a una forma reducida.
  const tiny = size < 24

  // "fecard" es una palabra, no un ícono: rompe el molde cuadrado de las
  // demás variantes (viewBox propio, más ancho) y bajo 24px no cae a una
  // versión reducida de sí misma sino al monograma "Contención" — un
  // wordmark de 6 letras es ilegible en tamaño de favicon.
  if (variant === 'fecard') {
    if (tiny) {
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 ${CONTACT_SHADOW} ${className}`}
        >
          <ContencionMark ink={ink} accent={accent} tiny={tiny} reduce={shouldReduceMotion} />
        </svg>
      )
    }
    return (
      <svg
        width={size * 3.3}
        height={size}
        viewBox="0 0 132 40"
        aria-hidden="true"
        className={`shrink-0 ${CONTACT_SHADOW} ${interactive ? 'transition-opacity duration-300 ease-out group-hover:opacity-80' : ''} ${className}`}
      >
        <FeCarDMark ink={ink} accent={accent} reduce={shouldReduceMotion} />
      </svg>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${CONTACT_SHADOW} ${interactive ? 'transition-opacity duration-300 ease-out group-hover:opacity-80' : ''} ${className}`}
    >
      {variant === 'cuenco' && <CuencoMark ink={ink} accent={accent} tiny={tiny} reduce={shouldReduceMotion} />}
      {variant === 'puntoSeguido' && (
        <PuntoSeguidoMark ink={ink} accent={accent} tiny={tiny} reduce={shouldReduceMotion} />
      )}
      {variant === 'contencion' && (
        <ContencionMark ink={ink} accent={accent} tiny={tiny} reduce={shouldReduceMotion} />
      )}
      {variant === 'entrevista' && (
        <EntrevistaMark ink={ink} accent={accent} tiny={tiny} reduce={shouldReduceMotion} />
      )}
    </svg>
  )
}

// Transición estándar de trazo: mismo "puño" para los 5 marks, para que
// cambiar de variante en el switcher se sienta como una sola familia.
const DRAW = { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
const drawProps = (reduce, delay = 0) => ({
  initial: reduce ? false : { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { ...DRAW, delay },
})
const popProps = (reduce, delay = 0) => ({
  initial: reduce ? false : { opacity: 0, scale: 0.3 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: 'backOut', delay },
})

/**
 * FeCarD: la firma real que Felipe usa para su poesía ("Permanentes", en su
 * sitio de difusión poética) — FElipe CARo Díaz. Las mayúsculas F/C/D ya
 * marcan las tres partes del nombre; el wordmark solo revela ese patrón que
 * él mismo escribió, con peso/color distinto en las mayúsculas (acento) vs.
 * las minúsculas de enlace (tinta) — no es un logo inventado desde cero.
 * Entrada: las letras aparecen en el orden en que se escriben (como
 * viéndolo firmar), no todas de golpe.
 * Riesgo a vigilar (documentado para Alexis/Felipe, no resuelto acá): esta
 * es su firma de poeta, no de psicólogo clínico — usarla como marca
 * principal del sitio mezcla esos dos registros; evaluar antes de fijarla.
 */
function FeCarDMark({ ink, accent, reduce }) {
  const letters = [
    { ch: 'F', cap: true },
    { ch: 'e', cap: false },
    { ch: 'C', cap: true },
    { ch: 'a', cap: false },
    { ch: 'r', cap: false },
    { ch: 'D', cap: true },
  ]
  return (
    <text x="2" y="30" fontFamily="'Newsreader Variable', Georgia, serif" fontStyle="italic" fontSize="30">
      {letters.map(({ ch, cap }, i) => (
        <motion.tspan
          key={i}
          fill={cap ? accent : ink}
          fontWeight={cap ? 700 : 400}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: i * 0.09, ease: 'easeOut' }}
        >
          {ch}
        </motion.tspan>
      ))}
    </text>
  )
}

/** Identidad actual: anillo abierto (vasija/ola/oído) + semilla entrando por la apertura. */
function CuencoMark({ ink, accent, tiny, reduce }) {
  return (
    <>
      <motion.path
        d="M 39.97 18.19 A 17 17 0 1 1 29.81 8.03"
        stroke={ink}
        strokeWidth={tiny ? 6 : 4.8}
        strokeLinecap="round"
        {...drawProps(reduce)}
      />
      {tiny ? (
        <motion.circle cx="29.9" cy="18.1" r="3.4" fill={accent} {...popProps(reduce, 0.45)} />
      ) : (
        <motion.ellipse
          cx="29.9"
          cy="18.1"
          rx="2.6"
          ry="3.2"
          fill={accent}
          transform="rotate(-38 29.9 18.1)"
          {...popProps(reduce, 0.45)}
        />
      )}
    </>
  )
}

/** Punto y seguido: después del punto, la frase continúa. Entrada: primero el punto, después la línea que sigue. */
function PuntoSeguidoMark({ ink, accent, tiny, reduce }) {
  return (
    <>
      <motion.circle cx="11" cy="24" r={tiny ? 5 : 4.2} fill={ink} {...popProps(reduce, 0)} />
      <motion.path
        d="M21 24 H40"
        stroke={accent}
        strokeWidth={tiny ? 6 : 4.8}
        strokeLinecap="round"
        {...drawProps(reduce, 0.2)}
      />
    </>
  )
}

// ——— Iteración 4: monogramas FC (encargo de Alexis: "juego de su nombre y
// apellido con algún símbolo de psicología sin llegar a ser cliché").
// Técnicas de referencia: contención letterform (GE/EA: la letra como marco),
// contraforma tipo V&A (la segunda letra vive en el hueco de la primera),
// minúscula manuscrita como firma (ck de Calvin Klein: cercanía), y dos
// letterforms enfrentadas cuyo espacio intermedio es la sesión.
// Descartado en render: fusionar C+F por trazo compartido — cualquier C cuya
// apertura queda bloqueada por el asta de la F cierra en "D" (Gestalt).

/** Contención: la C rodea a la F sin cerrarse sobre ella — un solo glifo CF. Entrada: la C se dibuja, luego la F queda contenida dentro. */
function ContencionMark({ ink, accent, tiny, reduce }) {
  if (tiny) {
    return (
      <>
        {/* C: círculo centro (24,24) r17, abierta a la derecha */}
        <motion.path
          d="M 36.5 12.9 A 17 17 0 1 0 36.5 35.1"
          stroke={ink}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          {...drawProps(reduce)}
        />
        <motion.path d="M 21 14 V 34" stroke={accent} strokeWidth={6} strokeLinecap="round" {...drawProps(reduce, 0.3)} />
        <motion.path d="M 21 14 H 30" stroke={accent} strokeWidth={6} strokeLinecap="round" {...drawProps(reduce, 0.4)} />
      </>
    )
  }
  return (
    <>
      <motion.path
        d="M 36.5 12.9 A 17 17 0 1 0 36.5 35.1"
        stroke={ink}
        strokeWidth={4.8}
        strokeLinecap="round"
        fill="none"
        {...drawProps(reduce)}
      />
      <motion.path d="M 20 15 V 33" stroke={accent} strokeWidth={4.2} strokeLinecap="round" {...drawProps(reduce, 0.3)} />
      <motion.path d="M 20 15 H 29" stroke={accent} strokeWidth={4.2} strokeLinecap="round" {...drawProps(reduce, 0.42)} />
      <motion.path d="M 20 24 H 27" stroke={accent} strokeWidth={4.2} strokeLinecap="round" {...drawProps(reduce, 0.5)} />
    </>
  )
}

/** Entrevista: F y C frente a frente; el espacio entre ambas es la sesión. Entrada: primero aparece la F, luego la C — una habla, la otra escucha y responde. */
function EntrevistaMark({ ink, accent, tiny, reduce }) {
  const sw = tiny ? 6 : 4.8
  return (
    <>
      <motion.path d="M 8 9 V 39" stroke={ink} strokeWidth={sw} strokeLinecap="round" {...drawProps(reduce)} />
      <motion.path d="M 8 9 H 18" stroke={ink} strokeWidth={sw} strokeLinecap="round" {...drawProps(reduce, 0.15)} />
      {!tiny && (
        <motion.path d="M 8 23 H 16.5" stroke={ink} strokeWidth={sw} strokeLinecap="round" {...drawProps(reduce, 0.25)} />
      )}
      {/* C: centro (33,24) r11.5, abierta hacia la F (izquierda) */}
      <motion.path
        d="M 25.6 15.2 A 11.5 11.5 0 1 1 25.6 32.8"
        stroke={accent}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
        {...drawProps(reduce, 0.35)}
      />
    </>
  )
}
