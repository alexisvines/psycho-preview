/**
 * GridBackground: A subtle background pattern using CSS gradients.
 * Creates a grid of dots or lines without any JavaScript or canvas.
 */
export function GridBackground({ children, className = '' }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(120, 113, 108, 0.1) 1px, transparent 1px),
          radial-gradient(circle, rgba(120, 113, 108, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px, 50px 50px',
        backgroundPosition: '0 0, 25px 25px',
      }}
    >
      {children}
    </div>
  );
}
