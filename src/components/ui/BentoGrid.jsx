/**
 * BentoGrid: An asymmetric grid layout for displaying cards with varying sizes.
 * Uses CSS Grid with template areas for responsive layout.
 */
export function BentoGrid({ children, className = '' }) {
  return (
    <div
      className={`grid gap-6 auto-rows-max ${className}`}
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gridAutoFlow: 'dense',
      }}
    >
      {children}
    </div>
  );
}

/**
 * BentoCard: Individual card in a BentoGrid that can span multiple columns.
 * Supports responsive spanning with col and row props.
 */
export function BentoCard({ children, className = '', colSpan = 1, rowSpan = 1, ...props }) {
  return (
    <div
      className={className}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
