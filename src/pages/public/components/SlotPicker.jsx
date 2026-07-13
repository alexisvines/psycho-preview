import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { addDays, format, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { CalendarX2, Zap, Sun, Sunset } from 'lucide-react'
import { publicAPI } from '@/api/endpoints'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { staggerContainer, staggerItem } from '@/lib/motion'
import { groupSlotsByPeriod } from '../bookingWizard'

const DAYS_AHEAD = 14
// Tope de días consultados por escaneo (carga inicial o "Lo antes posible"):
// hay rate limiting por IP en /api/public/appointments*, así que no
// disparamos más de 7 requests seguidos aunque el paciente no tenga hora
// libre en las próximas dos semanas.
const SCAN_LIMIT = 7
// staleTime alto: el escaneo y el strip comparten la misma queryKey, así que
// una vez consultado un día no se vuelve a pedir al backend en esta sesión.
const STALE_TIME = 5 * 60 * 1000

function dateKeyOf(day) {
  return format(day, 'yyyy-MM-dd')
}

/**
 * Selector de fecha + hora, compartido por Booking (nueva reserva) y
 * RescheduleAppointment (reagendar). Controlado: el padre guarda el
 * slot elegido y lo resetea cuando cambia la fecha.
 *
 * No asume que "hoy" tiene horas libres: al montar escanea hacia adelante
 * (día a día, con caché) y selecciona el primer día con disponibilidad.
 * "Lo antes posible" repite ese escaneo y además selecciona el primer
 * horario libre que encuentra.
 */
export default function SlotPicker({ selectedSlot, onSelectSlot, showAsap = true }) {
  const today = useMemo(() => new Date(), [])
  const days = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, i) => addDays(today, i)), [today])
  const queryClient = useQueryClient()

  const [selectedDate, setSelectedDate] = useState(days[0])
  const [dayStatus, setDayStatus] = useState({}) // dateKey -> 'has' | 'empty'
  const [isScanning, setIsScanning] = useState(false)
  const [scanExhausted, setScanExhausted] = useState(false)
  const didInitialScan = useRef(false)

  const dateKey = dateKeyOf(selectedDate)

  const fetchDay = useCallback(
    (day) => {
      const key = dateKeyOf(day)
      return queryClient
        .fetchQuery({
          queryKey: ['public-availability', key],
          queryFn: () => publicAPI.getAvailability(key),
          staleTime: STALE_TIME,
        })
        .then((res) => {
          const slots = res?.data || []
          setDayStatus((prev) => ({ ...prev, [key]: slots.length > 0 ? 'has' : 'empty' }))
          return slots
        })
        .catch(() => {
          setDayStatus((prev) => ({ ...prev, [key]: 'empty' }))
          return []
        })
    },
    [queryClient]
  )

  const scanForward = useCallback(
    async (fromIndex, { autoSelectFirstSlot = false } = {}) => {
      setIsScanning(true)
      setScanExhausted(false)
      const upTo = Math.min(fromIndex + SCAN_LIMIT, days.length)
      for (let i = fromIndex; i < upTo; i++) {
        const day = days[i]
        const slots = await fetchDay(day)
        if (slots.length > 0) {
          setSelectedDate(day)
          onSelectSlot(autoSelectFirstSlot ? slots[0] : null)
          setIsScanning(false)
          return true
        }
      }
      setIsScanning(false)
      setScanExhausted(true)
      return false
    },
    [days, fetchDay, onSelectSlot]
  )

  useEffect(() => {
    if (didInitialScan.current) return
    didInitialScan.current = true
    scanForward(0)
    // Solo al montar: no re-escanear si scanForward cambia de identidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    data: slotsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['public-availability', dateKey],
    queryFn: () => publicAPI.getAvailability(dateKey),
    select: (res) => res.data,
    staleTime: STALE_TIME,
  })

  useEffect(() => {
    if (slotsResponse !== undefined) {
      setDayStatus((prev) => ({ ...prev, [dateKey]: slotsResponse.length > 0 ? 'has' : 'empty' }))
    }
  }, [slotsResponse, dateKey])

  const slots = slotsResponse || []
  const { morning, afternoon } = useMemo(() => groupSlotsByPeriod(slots), [slots])

  const handleDateClick = (day) => {
    setScanExhausted(false)
    setSelectedDate(day)
    onSelectSlot(null)
  }

  const handleAsap = () => {
    onSelectSlot(null)
    scanForward(0, { autoSelectFirstSlot: true })
  }

  const showLoading = isLoading || isScanning
  const showEmpty = !showLoading && (isError || slots.length === 0)

  return (
    <div>
      {showAsap && (
        <button
          type="button"
          onClick={handleAsap}
          disabled={isScanning}
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors disabled:opacity-60"
        >
          <Zap size={14} className={isScanning ? 'animate-pulse' : ''} />
          {isScanning ? 'Buscando la hora más próxima…' : 'Lo antes posible'}
        </button>
      )}

      {/* Strip de fechas */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const status = dayStatus[dateKeyOf(day)]
          return (
            <button
              key={day.toISOString()}
              type="button"
              data-testid="slot-picker-date"
              onClick={() => handleDateClick(day)}
              className={`relative shrink-0 flex flex-col items-center justify-center w-16 h-18 py-2 rounded-xl border transition-colors ${
                isSelected
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-surface border-line/10 text-stone-700 hover:border-primary-300'
              }`}
            >
              <span className="text-xs uppercase font-medium opacity-80">
                {format(day, 'EEE', { locale: es })}
              </span>
              <span className="text-lg font-bold">{format(day, 'd')}</span>
              {status && (
                <span
                  data-testid="slot-picker-dot"
                  className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${
                    status === 'has' ? 'bg-primary-500' : isSelected ? 'bg-white/50' : 'bg-line/20'
                  }`}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Grid de horarios */}
      <div className="mt-6">
        {showLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-11" />
            ))}
          </div>
        ) : showEmpty ? (
          scanExhausted ? (
            <EmptyState
              icon={CalendarX2}
              title="Sin horarios cercanos"
              description="No encontramos horas en los próximos días — revisa el strip o intenta más tarde."
            />
          ) : (
            <EmptyState
              icon={CalendarX2}
              title="Sin horarios disponibles"
              description="No hay horas libres este día. Prueba con otra fecha."
            />
          )
        ) : (
          <div className="space-y-6">
            <SlotGroup
              label="Mañana"
              icon={Sun}
              slots={morning}
              selectedSlot={selectedSlot}
              onSelectSlot={onSelectSlot}
            />
            <SlotGroup
              label="Tarde"
              icon={Sunset}
              slots={afternoon}
              selectedSlot={selectedSlot}
              onSelectSlot={onSelectSlot}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function SlotGroup({ label, icon: Icon, slots, selectedSlot, onSelectSlot }) {
  if (slots.length === 0) return null
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-300 mb-2.5">
        <Icon size={13} /> {label}
      </div>
      <motion.div
        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {slots.map((slot) => {
          const isSelected = selectedSlot?.startTime === slot.startTime
          return (
            <motion.button
              key={slot.startTime}
              type="button"
              data-testid="slot-picker-slot"
              variants={staggerItem}
              onClick={() => onSelectSlot(slot)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                isSelected
                  ? 'bg-primary-600 border-primary-600 text-white'
                  : 'bg-surface border-line/10 text-stone-700 hover:border-primary-300 hover:bg-primary-50'
              }`}
            >
              {slot.timeLabel}
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
