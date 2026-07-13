// Marca de Felipe Caro: "El cuenco que recibe" — anillo abierto (vasija, ola,
// oído) con una semilla terracota entrando por la apertura: la palabra del
// paciente, sostenida con cuidado. Identidad elegida por Alexis/Felipe tras
// proceso de conceptos y refinamiento en Claude Design (2026-07-11).
// Spec final: trazo medio, apertura arriba-derecha, terminales redondeados,
// semilla orgánica descentrada hacia la apertura.
export function BrandMark({ size = 36, className = '', tone = 'color', interactive = false }) {
  // tone: 'color' (salvia sobre claro) | 'negative' (crema sobre oscuro)
  const ring = tone === 'negative' ? '#f5efe3' : '#4a5d42'
  const seed = tone === 'negative' ? '#d38e5f' : '#c4764a'
  // Bajo ~24px la semilla orgánica se pierde: cae a círculo (regla del favicon)
  const tiny = size < 24

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${interactive ? 'transition-transform duration-300 ease-out group-hover:rotate-[14deg]' : ''} ${className}`}
    >
      <path
        d="M 39.97 18.19 A 17 17 0 1 1 29.81 8.03"
        stroke={ring}
        strokeWidth={tiny ? 6 : 4.8}
        strokeLinecap="round"
      />
      {tiny ? (
        <circle cx="29.9" cy="18.1" r="3.4" fill={seed} />
      ) : (
        <ellipse
          cx="29.9"
          cy="18.1"
          rx="2.6"
          ry="3.2"
          fill={seed}
          transform="rotate(-38 29.9 18.1)"
        />
      )}
    </svg>
  )
}
