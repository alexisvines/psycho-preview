import { motion } from 'framer-motion'
import { Mail, Hourglass, CalendarPlus, Check } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/motion'

const MILESTONES = [
  { icon: Mail, title: 'Te enviamos un email', description: 'Con el link para confirmar tu hora.' },
  { icon: Hourglass, title: 'Confirma tu hora', description: 'Tienes 2 horas antes de que el cupo se libere.' },
  {
    icon: CalendarPlus,
    title: 'Recibe la invitación',
    description: 'Un archivo .ics para agregar la sesión a tu calendario.',
  },
]

/** Mini-timeline vertical de la pantalla de éxito tras reservar. */
export default function SuccessTimeline() {
  return (
    <motion.ol className="relative space-y-6 pl-1" variants={staggerContainer} initial="initial" animate="animate">
      {MILESTONES.map((step, i) => {
        const Icon = step.icon
        const isLast = i === MILESTONES.length - 1
        return (
          <motion.li key={step.title} variants={staggerItem} className="relative flex gap-4">
            {!isLast && (
              <span className="absolute left-[15px] top-9 h-[calc(100%-4px)] w-px bg-primary-100" aria-hidden="true" />
            )}
            <span className="relative shrink-0 h-8 w-8 rounded-full bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center">
              <Icon size={15} />
            </span>
            <div className="pt-0.5 text-left">
              <p className="text-sm font-semibold text-stone-900">{step.title}</p>
              <p className="text-sm text-stone-500 mt-0.5">{step.description}</p>
            </div>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}

export function SuccessSummaryBadge({ sessionType, dateLabel, timeLabel }) {
  if (!sessionType && !dateLabel) return null
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium px-4 py-1.5">
      <Check size={14} strokeWidth={3} />
      {[sessionType, dateLabel, timeLabel].filter(Boolean).join(' · ')}
    </div>
  )
}
