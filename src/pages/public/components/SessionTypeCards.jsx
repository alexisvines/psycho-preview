import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { SESSION_TYPES } from '../bookingWizard'
import { staggerContainer, staggerItem } from '@/lib/motion'

/**
 * Paso 1 del wizard de reserva: radio-cards accesibles (input radio real
 * oculto con sr-only, así el navegador da roving focus + navegación con
 * flechas gratis). La selección solo decide el prefijo de `reasonForConsult`
 * al enviar — cero cambios al DTO del backend.
 */
export default function SessionTypeCards({ value, onChange }) {
  return (
    <motion.div
      role="radiogroup"
      aria-label="Tipo de sesión"
      className="grid sm:grid-cols-2 gap-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {SESSION_TYPES.map((type) => {
        const Icon = type.icon
        const isSelected = value === type.id
        return (
          <motion.label
            key={type.id}
            variants={staggerItem}
            className={`relative flex flex-col gap-3 rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'border-primary-500 bg-primary-50/60 shadow-md ring-1 ring-primary-200'
                : 'border-line/10 bg-surface hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5'
            } ${type.featured ? 'sm:col-span-2' : ''}`}
          >
            <input
              type="radio"
              name="sessionType"
              value={type.id}
              checked={isSelected}
              onChange={() => onChange(type.id)}
              className="sr-only"
            />
            {type.badge && (
              <span className="inline-flex self-start items-center gap-1 rounded-full bg-primary-600 text-white text-xs font-semibold px-2.5 py-1">
                {type.badge}
              </span>
            )}
            <div className="flex items-start gap-3.5">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-500'
                }`}
              >
                <Icon size={19} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-medium text-stone-900 leading-snug">{type.label}</p>
                <p className="text-sm text-stone-600 mt-1 leading-snug">{type.description}</p>
              </div>
              <motion.div
                initial={false}
                animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="ml-auto shrink-0 h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center"
              >
                <Check size={14} strokeWidth={3} />
              </motion.div>
            </div>

            {type.id === 'primera-consulta' && (
              <Link
                to="/#psicoanalisis"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 underline underline-offset-2 decoration-primary-300 hover:decoration-primary-500 transition-colors w-fit"
              >
                ¿No sabes si este enfoque es para ti? Conoce el psicoanálisis →
              </Link>
            )}
          </motion.label>
        )
      })}
    </motion.div>
  )
}
