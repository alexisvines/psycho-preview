import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { CardContent } from '@/components/ui/Card'
import { GlowCard } from '@/components/ui/GlowCard'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

const whatsAppSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre'),
})

// `service`: motivo pre-seleccionado al hacer clic en "Agendar" desde una
// card de Servicios (Landing.jsx guarda cuál fue en estado y lo pasa acá).
// Se suma al mensaje sin pedirle nada más a la persona ni mostrar UI extra
// — la persona solo ve el formulario de siempre, el motivo viaja "callado".
export default function WhatsAppCTA({ service = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(whatsAppSchema),
  })

  const onSubmit = (data) => {
    const message = service
      ? `Hola Felipe, soy ${data.name} y te contacto desde tu página por el servicio de ${service.toLowerCase()}`
      : `Hola Felipe, soy ${data.name} y te contacto desde tu página para ver una posible cita`
    const whatsappUrl = `https://wa.me/56954072852?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <GlowCard className="border-transparent">
      <CardContent className="p-7 sm:p-9">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-900 mb-2">
              Tu nombre
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Ingresa tu nombre"
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <Button type="submit" variant="primary" className="w-full gap-2">
            <WhatsAppIcon size={19} />
            Agenda por WhatsApp
          </Button>
          <p className="text-xs text-stone-500 text-center">
            Se abrirá WhatsApp con tu mensaje ya escrito, listo para enviar.
          </p>
        </form>
      </CardContent>
    </GlowCard>
  )
}
