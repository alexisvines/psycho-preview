import { motion } from 'framer-motion'

const STEPS = [
  { n: 1, label: 'Tipo de sesión' },
  { n: 2, label: 'Fecha y hora' },
  { n: 3, label: 'Tus datos' },
]

/**
 * Indicador de progreso editorial: números 01/02/03 en Fraunces + línea de
 * progreso animada. Los pasos ya completados son clickeables para volver
 * atrás; los futuros no (hay que validar cada paso para avanzar).
 */
export default function WizardProgress({ step, onStepClick }) {
  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex items-start justify-between gap-2">
        {STEPS.map((s) => {
          const isActive = s.n === step
          const isDone = s.n < step
          const clickable = isDone
          return (
            <button
              key={s.n}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(s.n)}
              className={`flex-1 text-left group ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`font-display text-2xl sm:text-3xl block mb-1 transition-colors ${
                  isActive ? 'text-primary-600' : isDone ? 'text-stone-900' : 'text-stone-300'
                }`}
              >
                0{s.n}
              </span>
              <span
                className={`block text-[11px] sm:text-xs uppercase tracking-[0.14em] font-semibold transition-colors ${
                  isActive
                    ? 'text-stone-900'
                    : isDone
                      ? 'text-stone-500 group-hover:text-primary-600'
                      : 'text-stone-300'
                }`}
              >
                {s.label}
              </span>
            </button>
          )
        })}
      </div>
      <div className="relative mt-4 h-1 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary-600 rounded-full"
          initial={false}
          animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
