import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { MapPin, Star, Pencil } from 'lucide-react'
import felipePortrait from '@/assets/felipe-whatsapp.jpg'
import { getSlotDurationMinutes } from '../bookingWizard'

function capitalize(text) {
  if (!text) return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function SummaryRow({ label, value, icon: Icon, onEdit }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-semibold text-stone-400">
          {Icon && <Icon size={11} />}
          {label}
        </p>
        <p className="text-sm font-medium text-stone-800 mt-0.5 truncate">{value}</p>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 mt-0.5"
        >
          <Pencil size={11} /> Editar
        </button>
      )}
    </div>
  )
}

/**
 * Resumen vivo de la reserva en curso: sidebar sticky en desktop (paso 2/3),
 * card compacta en mobile. Va sumando datos a medida que el paciente avanza
 * por el wizard (tipo de sesión → fecha/hora).
 */
export default function BookingSummaryPanel({ sessionType, selectedSlot, onEdit, variant = 'sidebar' }) {
  const duration = getSlotDurationMinutes(selectedSlot)
  const dateLabel = selectedSlot?.startTime
    ? capitalize(format(parseISO(selectedSlot.startTime), "EEEE d 'de' MMMM", { locale: es }))
    : null

  return (
    <div className={variant === 'sidebar' ? 'lg:sticky lg:top-24' : ''}>
      <div
        className={`rounded-2xl border border-primary-900/10 bg-surface p-5 sm:p-6 ${
          variant === 'sidebar' ? 'shadow-card' : 'shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={felipePortrait}
            alt="Felipe Caro"
            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-100"
            style={{ objectPosition: '50% 10%' }}
          />
          <div>
            <p className="font-display text-base font-medium text-stone-900">Felipe Caro</p>
            <p className="text-xs text-stone-500">Psicólogo clínico</p>
          </div>
        </div>

        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-600">
          <Star size={13} className="fill-amber-500 text-amber-500" />
          5,0 · 44 reseñas
        </div>

        <div className="mt-5 space-y-3.5 border-t border-stone-100 pt-4">
          {sessionType && (
            <SummaryRow
              label="Tipo de sesión"
              value={sessionType.label}
              onEdit={onEdit ? () => onEdit(1) : undefined}
            />
          )}
          {selectedSlot && (
            <SummaryRow
              label="Fecha y hora"
              value={`${dateLabel} · ${selectedSlot.timeLabel}`}
              onEdit={onEdit ? () => onEdit(2) : undefined}
            />
          )}
          {duration != null && <SummaryRow label="Duración" value={`${duration} min`} />}
          <SummaryRow label="Dirección" value="Lautaro 1775, San Antonio" icon={MapPin} />
        </div>
      </div>
    </div>
  )
}
