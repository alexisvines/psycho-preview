// Overlay de grano sutil vía SVG feTurbulence como data-URI inline: sin
// requests de red, coste de performance prácticamente nulo (una sola capa
// de fondo repetida). opacity muy baja para dar textura editorial/impresa
// sin ensuciar la composición.
const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
    <feColorMatrix type='saturate' values='0'/>
  </filter>
  <rect width='100%' height='100%' filter='url(%23n)'/>
</svg>`;

const GRAIN_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

export function GrainOverlay({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
      style={{
        backgroundImage: GRAIN_DATA_URI,
        backgroundRepeat: 'repeat',
        opacity: 0.04,
        mixBlendMode: 'multiply',
      }}
    />
  );
}
