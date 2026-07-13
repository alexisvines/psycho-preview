import { addMinutes, format, getDay, setHours, setMinutes, startOfDay } from 'date-fns'

// Genera horarios falsos con la misma forma que el backend real
// (TimeSlot: startTime/endTime ISO + timeLabel "HH:mm - HH:mm"), sin pegarle
// a ningún servidor. Fines de semana sin horas; lunes a viernes con bloques
// de mañana (9-13) y tarde (15-19) cada 50 min, salvo un puñado "ocupado"
// derivado del día (determinístico, para que no cambie entre recargas).
const SLOT_MINUTES = 50
const BLOCKS = [
  { startHour: 9, endHour: 13 },
  { startHour: 15, endHour: 19 },
]

function buildDaySlots(date) {
  const dayOfWeek = getDay(date) // 0 domingo, 6 sábado
  if (dayOfWeek === 0 || dayOfWeek === 6) return []

  const seed = date.getDate() + date.getMonth() * 31
  const slots = []

  for (const block of BLOCKS) {
    let cursor = setMinutes(setHours(startOfDay(date), block.startHour), 0)
    const blockEnd = setMinutes(setHours(startOfDay(date), block.endHour), 0)
    let i = 0
    while (cursor < blockEnd) {
      const end = addMinutes(cursor, SLOT_MINUTES)
      if (end > blockEnd) break
      // "Ocupa" ~1 de cada 3 horarios de forma estable por día, para que el
      // grid no se vea sospechosamente lleno.
      const isBusy = (seed + i) % 3 === 0
      if (!isBusy) {
        slots.push({
          startTime: cursor.toISOString(),
          endTime: end.toISOString(),
          timeLabel: `${format(cursor, 'HH:mm')} - ${format(end, 'HH:mm')}`,
        })
      }
      cursor = addMinutes(cursor, SLOT_MINUTES)
      i++
    }
  }

  return slots
}

/** Simula la latencia real del endpoint de disponibilidad. */
export function getDemoAvailability(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`)
  const slots = buildDaySlots(date)
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data: slots }), 260)
  })
}
