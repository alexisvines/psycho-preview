/**
 * WatercolorWash: lavado de acuarela abstracto, MUY sutil (opacidad
 * 4-6%), en tonos salvia/terracota/arena — atmósfera de fondo para
 * secciones editoriales (Evidencia, Enfoque psicoanalítico). Formas
 * orgánicas radiales con blur, estáticas (sin animación: es una textura
 * ambiental, no un elemento interactivo), `pointer-events-none` y sin
 * costo de red (nada de imágenes, todo CSS/SVG inline).
 */
export function WatercolorWash({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute -top-[10%] left-[5%] h-[55%] w-[55%] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #4a5d42 0%, transparent 70%)', opacity: 0.05 }}
      />
      <div
        className="absolute top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #c4764a 0%, transparent 70%)', opacity: 0.045 }}
      />
      <div
        className="absolute -bottom-[15%] left-[20%] h-[45%] w-[45%] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #d9c9a8 0%, transparent 70%)', opacity: 0.06 }}
      />
    </div>
  )
}
