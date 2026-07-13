import { motion, useReducedMotion } from 'framer-motion'
import { WhatsAppIcon } from './WhatsAppIcon'

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
      transition={{ delay: 1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
      <WhatsAppIcon size={28} className="relative" />
    </motion.a>
  )
}
