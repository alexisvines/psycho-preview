// Encabezado de sección compartido por toda la landing: pequeña etiqueta
// small-caps de orientación ("SOBRE MÍ", "SERVICIOS"...) sobre un h2 en
// Fraunces, mismo tamaño/tracking en todas las secciones — el patrón
// clásico de sitios editoriales que ordena la lectura de una página larga.
export function SectionLabel({ children, align = 'left' }) {
  return (
    <span
      className={`block text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 mb-3 ${
        align === 'center' ? 'text-center' : ''
      }`}
    >
      {children}
    </span>
  )
}

export function SectionHeading({ label, children, align = 'left', className = '', as: Tag = 'h2' }) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {label && <SectionLabel align={align}>{label}</SectionLabel>}
      <Tag className={`font-display text-3xl sm:text-4xl font-semibold text-stone-900 leading-[1.1] tracking-tight ${className}`}>
        {children}
      </Tag>
    </div>
  )
}
