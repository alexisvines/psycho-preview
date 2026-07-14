import { motion, useReducedMotion } from 'framer-motion'

// Glifo del teléfono, solo el trazo (sin círculo verde propio — este
// componente ya dibuja su propio círculo de fondo). El WhatsAppIcon
// compartido (./WhatsAppIcon.jsx) trae su círculo incluido para usarse en
// líneas de texto/botones; ponerlo acá duplicaría el círculo.
function PhoneGlyph({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.84-3.04-.2-.32a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.8c-.01 4.55-3.7 8.27-8.25 8.27Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.22-.08-.38-.12-.55.13-.16.25-.63.8-.77.97-.14.17-.28.19-.53.06-.25-.12-1.05-.38-2-1.22-.74-.66-1.23-1.47-1.37-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.28.38-.42.13-.14.17-.25.26-.41.08-.16.04-.31-.02-.43-.07-.12-.55-1.35-.75-1.84-.19-.49-.39-.42-.55-.43-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.31-.22.25-.85.84-.85 2.07 0 1.23.87 2.42 1 2.58.13.17 1.75 2.67 4.13 3.74.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.09.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.06.15-1.17-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  )
}

// Botón flotante de contacto directo — verde de marca WhatsApp fijo (no el
// de la paleta del sitio): es un afordance de terceros ya reconocido por
// el visitante, cambiarlo a la paleta activa lo haría menos identificable,
// no más coherente. Aro pulsante sutil (no llamativo) para dar a entender
// que es interactivo sin romper el tono calmado del resto del sitio.
export function WhatsAppButton({ phone, message, className = '' }) {
  const shouldReduceMotion = useReducedMotion()
  const digits = phone.replace(/\D/g, '')
  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      title="Escribir por WhatsApp"
      className={`fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lifted print:hidden ${className}`}
      initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
    >
      {!shouldReduceMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.5, 1.5], opacity: [0.55, 0, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.2 }}
        />
      )}
      <PhoneGlyph size={28} className="relative" />
    </motion.a>
  )
}
