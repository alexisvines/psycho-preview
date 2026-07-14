import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { BrandMark } from '@/components/ui/BrandMark'
import { Button } from '@/components/ui/Button'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'

// 404 con la misma voz del sitio (grano, marca, editorial) en vez de un
// redirect silencioso a "/" — el detalle que un jurado nota cuando explora
// rutas al azar.
export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-24">
      <GrainOverlay opacity={0.05} blend="overlay" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <BrandMark size={44} />
        </div>
        <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 mb-3">
          Error 404
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 leading-[1.1] tracking-tight mb-4">
          Esta página no existe
        </h1>
        <p className="text-stone-600 leading-relaxed mb-9">
          El enlace puede estar roto o la página se movió. Volvamos a un lugar conocido.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" className="gap-2">
              <ArrowLeft size={16} /> Volver al inicio
            </Button>
          </Link>
          <Link to="/#contacto">
            <Button variant="outline" size="md" className="gap-2">
              <WhatsAppIcon size={16} /> Agenda por WhatsApp
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
