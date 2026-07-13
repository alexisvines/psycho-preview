import { parseISO, getHours, differenceInMinutes } from 'date-fns'
import { Sparkles, CalendarCheck, Baby, HeartHandshake } from 'lucide-react'

// Extraído a un módulo puro (sin JSX/React) para poder testear con vitest
// sin montar componentes: agrupar horarios, construir el motivo de consulta
// y decidir si se puede avanzar de paso en el wizard de reserva.

export const SESSION_TYPES = [
  {
    id: 'primera-consulta',
    label: 'Primera consulta',
    description: 'Nos conocemos, entendemos qué te trae y definimos juntos un rumbo.',
    icon: Sparkles,
    badge: '¿Primera vez? Empieza aquí',
    featured: true,
  },
  {
    id: 'seguimiento',
    label: 'Sesión de seguimiento',
    description: 'Para continuar tu proceso si ya eres paciente.',
    icon: CalendarCheck,
  },
  {
    id: 'consulta-hijo',
    label: 'Consulta por tu hijo/a',
    description: 'Terapia infanto-juvenil: acompañamiento especializado para niños y adolescentes.',
    icon: Baby,
  },
  {
    id: 'orientacion-padres',
    label: 'Orientación a padres',
    description: 'Herramientas para apoyar el proceso de tus hijos.',
    icon: HeartHandshake,
  },
]

export function getSessionType(id) {
  return SESSION_TYPES.find((type) => type.id === id) || null
}

/**
 * Antepone la categoría elegida en el paso 1 al motivo de consulta escrito
 * en el paso 3, sin cambiar el DTO que espera el backend (sigue siendo un
 * único string en `reasonForConsult`).
 */
export function buildReasonForConsult(sessionTypeLabel, text) {
  const trimmed = (text || '').trim()
  if (!sessionTypeLabel) return trimmed || undefined
  return trimmed ? `[${sessionTypeLabel}] ${trimmed}` : `[${sessionTypeLabel}]`
}

/**
 * Agrupa TimeSlot[] (startTime ISO, timeLabel "HH:mm - HH:mm") en Mañana
 * (antes de las 13:00) y Tarde (13:00 en adelante).
 */
export function groupSlotsByPeriod(slots = []) {
  const morning = []
  const afternoon = []
  for (const slot of slots) {
    const hour = getHours(parseISO(slot.startTime))
    if (hour < 13) morning.push(slot)
    else afternoon.push(slot)
  }
  return { morning, afternoon }
}

/** Duración del slot en minutos, o null si falta algún dato. */
export function getSlotDurationMinutes(slot) {
  if (!slot?.startTime || !slot?.endTime) return null
  return differenceInMinutes(parseISO(slot.endTime), parseISO(slot.startTime))
}

/** Valida si se puede avanzar desde `step` (1|2) con el estado actual del wizard. */
export function canAdvanceFromStep(step, { sessionType, selectedSlot } = {}) {
  if (step === 1) return Boolean(sessionType)
  if (step === 2) return Boolean(selectedSlot)
  return true
}
