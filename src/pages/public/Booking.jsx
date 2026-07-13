import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { MailCheck, ArrowLeft, ArrowRight, Info, Lock, Wallet } from 'lucide-react'
import { publicAPI } from '@/api/endpoints'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { useAuth } from '@/context/AuthContext'
import SlotPicker from './components/SlotPicker'
import SessionTypeCards from './components/SessionTypeCards'
import WizardProgress from './components/WizardProgress'
import BookingSummaryPanel from './components/BookingSummaryPanel'
import SuccessTimeline, { SuccessSummaryBadge } from './components/SuccessTimeline'
import { SectionLabel } from './components/SectionHeading'
import { bookingSchema } from './bookingSchema'
import { getSessionType, buildReasonForConsult, canAdvanceFromStep } from './bookingWizard'

function stepMotion(shouldReduceMotion) {
  return {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
    },
    exit: shouldReduceMotion
      ? { opacity: 0, transition: { duration: 0.1 } }
      : { opacity: 0, y: -10, transition: { duration: 0.15 } },
  }
}

export default function Booking() {
  const { isAuthenticated } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  const [step, setStep] = useState(1)
  const [sessionTypeId, setSessionTypeId] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [advanceError, setAdvanceError] = useState('')

  const sessionType = getSessionType(sessionTypeId)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(bookingSchema) })

  const bookMutation = useMutation({
    mutationFn: (data) => publicAPI.book(data),
    onError: (err) => {
      if (err.response?.status === 429) {
        setErrorMessage('Demasiados intentos. Espera unos minutos antes de volver a intentarlo.')
      } else if (err.response?.status === 400) {
        setErrorMessage(
          err.response?.data?.message ||
            'No pudimos procesar tu reserva. Verifica los datos e intenta de nuevo.'
        )
      } else {
        setErrorMessage('Ocurrió un error inesperado. Intenta nuevamente en unos minutos.')
      }
    },
  })

  const goToStep = (n) => {
    if (n >= step) return
    setAdvanceError('')
    setStep(n)
  }

  const handleContinue = () => {
    if (!canAdvanceFromStep(step, { sessionType, selectedSlot })) {
      setAdvanceError(
        step === 1 ? 'Elige un tipo de sesión para continuar.' : 'Elige un horario disponible antes de continuar.'
      )
      return
    }
    setAdvanceError('')
    setStep((s) => s + 1)
  }

  const onSubmit = (data) => {
    if (!selectedSlot) {
      setAdvanceError('Elige un horario disponible antes de continuar.')
      setStep(2)
      return
    }
    setErrorMessage('')
    const { honeypot, reasonForConsult, ...rest } = data
    bookMutation.mutate({
      ...rest,
      honeypot,
      reasonForConsult: buildReasonForConsult(sessionType?.label, reasonForConsult),
      recaptchaToken: null,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    })
  }

  if (bookMutation.isSuccess) {
    const dateLabel = selectedSlot?.startTime
      ? format(parseISO(selectedSlot.startTime), "EEEE d 'de' MMMM", { locale: es })
      : null

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <EmptyState icon={MailCheck} title="Revisa tu email" />
          <div className="-mt-4 flex flex-col items-center gap-6">
            <SuccessSummaryBadge
              sessionType={sessionType?.label}
              dateLabel={dateLabel && dateLabel[0].toUpperCase() + dateLabel.slice(1)}
              timeLabel={selectedSlot?.timeLabel}
            />
            <p className="text-stone-600 text-center max-w-sm -mt-2">
              Te enviamos un link de confirmación. Tienes 2 horas para confirmar tu cita antes de que expire.
            </p>
            <Card className="w-full">
              <CardContent className="p-6 sm:p-7">
                <SuccessTimeline />
              </CardContent>
            </Card>
            <Link to="/">
              <Button variant="primary">Volver al inicio</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const motionProps = stepMotion(shouldReduceMotion)

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 pb-28 lg:pb-16">
      <GrainOverlay className="-z-10" />

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6"
      >
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <SectionLabel>Reserva</SectionLabel>
      <h1 className="font-display text-4xl sm:text-5xl font-medium text-stone-900 leading-[1.05] tracking-tight">
        Reservar hora
      </h1>
      <p className="text-stone-600 mt-3 mb-10 max-w-lg">
        Elige cómo quieres empezar y encontramos juntos el horario ideal.
      </p>

      {isAuthenticated && (
        <Card className="!bg-amber-50 !border-amber-200 mb-8">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="text-amber-600 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-amber-800">
              Estás logueado como profesional. Esta reserva se registrará como un paciente real. Para
              gestionar citas usa el panel.
            </p>
          </CardContent>
        </Card>
      )}

      <WizardProgress step={step} onStepClick={goToStep} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" {...motionProps}>
            <SessionTypeCards value={sessionTypeId} onChange={setSessionTypeId} />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" {...motionProps} className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
            <div className="lg:order-1">
              <BookingSummaryPanel sessionType={sessionType} selectedSlot={selectedSlot} />
            </div>
            {/* min-w-0: sin esto el item de grid crece al ancho intrínseco
                del strip de 14 días y desborda el viewport */}
            <Card className="lg:order-2 min-w-0">
              <CardContent className="p-6 sm:p-8">
                <SlotPicker selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" {...motionProps} className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
            <div className="lg:order-1">
              <BookingSummaryPanel sessionType={sessionType} selectedSlot={selectedSlot} onEdit={goToStep} />
            </div>

            <Card className="lg:order-2 min-w-0">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  {/* Honeypot: invisible para personas, atractivo para bots */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    defaultValue=""
                    className="absolute -left-[9999px]"
                    {...register('honeypot')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-1.5">Nombre completo</label>
                    <input
                      type="text"
                      {...register('patientName')}
                      placeholder="María González"
                      className={`w-full px-4 py-2 border rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-surface text-stone-900 placeholder-stone-400 ${
                        errors.patientName ? 'border-rose-500' : 'border-line/15'
                      }`}
                    />
                    {errors.patientName && (
                      <p className="text-rose-600 text-sm mt-1.5">{errors.patientName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-900 mb-1.5">Email</label>
                      <input
                        type="email"
                        {...register('patientEmail')}
                        placeholder="tu@email.com"
                        className={`w-full px-4 py-2 border rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-surface text-stone-900 placeholder-stone-400 ${
                          errors.patientEmail ? 'border-rose-500' : 'border-line/15'
                        }`}
                      />
                      {errors.patientEmail && (
                        <p className="text-rose-600 text-sm mt-1.5">{errors.patientEmail.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-900 mb-1.5">Teléfono</label>
                      <input
                        type="tel"
                        {...register('patientPhone')}
                        placeholder="+56 9 1234 5678"
                        className={`w-full px-4 py-2 border rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-surface text-stone-900 placeholder-stone-400 ${
                          errors.patientPhone ? 'border-rose-500' : 'border-line/15'
                        }`}
                      />
                      {errors.patientPhone && (
                        <p className="text-rose-600 text-sm mt-1.5">{errors.patientPhone.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-1.5">
                      Motivo de consulta <span className="text-stone-400 font-normal">(opcional)</span>
                    </label>
                    <textarea
                      {...register('reasonForConsult')}
                      rows={3}
                      placeholder="Cuéntame brevemente qué te gustaría trabajar"
                      className="w-full px-4 py-2 border border-line/15 rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-surface text-stone-900 placeholder-stone-400 resize-none"
                    />
                  </div>

                  <ul className="grid sm:grid-cols-3 gap-3 pt-2">
                    <li className="flex items-start gap-2 text-xs text-stone-500">
                      <Lock size={14} className="text-primary-500 dark:text-primary-300 shrink-0 mt-0.5" />
                      Todo lo que escribas es confidencial
                    </li>
                    <li className="flex items-start gap-2 text-xs text-stone-500">
                      <Wallet size={14} className="text-primary-500 dark:text-primary-300 shrink-0 mt-0.5" />
                      Sin pago online — pagas en la consulta
                    </li>
                    <li className="flex items-start gap-2 text-xs text-stone-500">
                      <MailCheck size={14} className="text-primary-500 dark:text-primary-300 shrink-0 mt-0.5" />
                      Te llegará un email para confirmar tu hora — tienes 2 horas
                    </li>
                  </ul>

                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-600 text-sm font-medium"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={bookMutation.isPending}
                    className="w-full hidden lg:inline-flex"
                  >
                    Confirmar reserva
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {advanceError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-rose-600 text-sm font-medium mt-4"
        >
          {advanceError}
        </motion.p>
      )}

      {/* CTA de avance: sticky abajo en mobile, inline en desktop (salvo el
          paso 3, cuyo submit vive dentro del <form> de arriba). */}
      {step < 3 && (
        <div className="fixed lg:static bottom-0 left-0 right-0 z-20 lg:z-auto lg:mt-8 lg:flex lg:justify-end">
          <div className="bg-surface/95 backdrop-blur border-t border-stone-200 lg:bg-transparent lg:border-0 lg:backdrop-blur-none px-4 py-3 lg:p-0">
            <Button type="button" variant="primary" size="lg" className="w-full lg:w-auto" onClick={handleContinue}>
              Continuar
              <ArrowRight size={18} className="ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fixed lg:hidden bottom-0 left-0 right-0 z-20 bg-surface/95 backdrop-blur border-t border-stone-200 px-4 py-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            loading={bookMutation.isPending}
            className="w-full"
            onClick={handleSubmit(onSubmit)}
          >
            Confirmar reserva
          </Button>
        </div>
      )}
    </div>
  )
}
