import { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Spotlight: A container that tracks mouse position and renders a radial gradient glow
 * that follows the cursor. Respects prefers-reduced-motion for accessibility.
 */
export function Spotlight({ children, className = '' }) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (shouldReduceMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    containerRef.current.style.setProperty('--x', `${x}px`);
    containerRef.current.style.setProperty('--y', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    containerRef.current.style.setProperty('--x', '50%');
    containerRef.current.style.setProperty('--y', '50%');
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--x': '50%',
        '--y': '50%',
      }}
    >
      {/* Spotlight gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: shouldReduceMotion
            ? 'radial-gradient(600px circle at 50% 50%, rgba(74, 133, 112, 0.08), transparent 40%)'
            : 'radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), rgba(74, 133, 112, 0.15), transparent 40%)',
          opacity: shouldReduceMotion ? 0.5 : 1,
        }}
      />
      {children}
    </div>
  );
}
