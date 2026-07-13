import { useReducedMotion } from 'framer-motion';

/**
 * MeshGradient: fondo crema plano con UNA sola insinuación radial cálida
 * (salvia + terracota, ~8-10% de opacidad) detrás de la zona de la foto del
 * hero. Antes eran tres blobs diagonales que "ensuciaban" el crema detrás
 * del titular (feedback de dos rondas de revisión de diseño). La animación
 * sigue siendo CSS pura, muy lenta, y se pausa con prefers-reduced-motion.
 */
export function MeshGradient({ className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ background: '#faf6ef' }}
      aria-hidden="true"
    >
      <div
        className="absolute top-[5%] right-[-10%] h-[85%] w-[55%] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(196, 118, 74, 0.10) 0%, rgba(107, 127, 94, 0.07) 45%, rgba(107, 127, 94, 0) 70%)',
          animation: shouldReduceMotion ? 'none' : 'mesh-blob-a 30s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes mesh-blob-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-3%, 4%) scale(1.06); }
        }
      `}</style>
    </div>
  );
}
