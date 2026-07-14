import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Menu, X, MapPin, Phone, Clock3 } from 'lucide-react'
import { BrandMark } from './ui/BrandMark'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { WhatsAppButton } from './ui/WhatsAppButton'
import { Button } from './ui/Button'
import { FALLBACKS } from '../pages/public/fallbacks'

const WHATSAPP_PHONE = '+56 9 5407 2852'

// Datos de contacto para la 3ª columna del footer: no requieren estado vivo
// del CMS (footer es zona utilitaria) — se leen directo de los fallbacks,
// misma fuente que usa Landing para la banda de cierre.
const FOOTER_CONTACT_LINES = FALLBACKS.contact.body.split('\n').filter(Boolean)
function footerContactIcon(line = '') {
  const key = line.toLowerCase()
  if (key.startsWith('dirección') || key.startsWith('direccion')) return MapPin
  if (key.startsWith('teléfono') || key.startsWith('telefono')) return Phone
  return Clock3
}

const anchors = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'El enfoque', href: '#psicoanalisis' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contacto', href: '#contacto' },
]

const routes = [
  { label: 'Escritos', to: '/escritos' },
]

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'
  const lenisRef = useRef(null)

  // Smooth scroll (Lenis): desactivado por completo si el usuario prefiere
  // menos movimiento. Loop propio vía requestAnimationFrame, destruido al
  // desmontar para no dejar listeners colgando entre navegaciones.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return undefined

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenisRef.current = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Glassmorphism del header: solo se activa tras un pequeño scroll, para
  // que el hero (que ya tiene su propio fondo) no se vea "doblemente" opaco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchorClick = (e, href) => {
    if (!isLanding) {
      // Desde otra página pública, primero navega a la landing y luego a la ancla
      e.preventDefault()
      navigate('/' + href)
      return
    }
    // En la landing: si Lenis está activo, delega el scroll suave a él en
    // vez del salto nativo del navegador.
    if (lenisRef.current) {
      const target = document.querySelector(href)
      if (target) {
        e.preventDefault()
        lenisRef.current.scrollTo(target, { offset: -8 })
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header: sticky, sin barra de "modo profesional" — esta vista previa
          no tiene login ni panel admin. */}
      <div className="sticky top-0 z-40">
        {/* Header: banda navy sólida siempre (no transparente/cream) — antes
            se confundía con el fondo de la página y encima se veía "sucio"
            al pasar sobre secciones oscuras (mismo fondo translúcido, dos
            problemas, una causa). Un header con su propio color, distinto
            del resto del sitio, también lee más "marca/servicio premium"
            que una barra que se mimetiza con el contenido. */}
        <header
          className={`bg-primary-950 transition-shadow duration-300 ${
            scrolled ? 'shadow-[0_2px_12px_rgba(0,0,0,0.18)]' : ''
          }`}
        >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <BrandMark size={34} interactive />
            <span className="font-display italic text-xl text-white leading-tight">
              Felipe Caro{' '}
              <span className="hidden sm:inline not-italic text-xs font-sans tracking-[0.18em] uppercase text-primary-300 align-middle ml-1">
                Psicólogo
              </span>
            </span>
          </Link>

          {/* Desktop nav: subrayado animado on hover/focus (crece desde el centro) */}
          <nav className="hidden md:flex items-center gap-8">
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={(e) => handleAnchorClick(e, a.href)}
                className="group relative text-sm font-medium text-primary-200 hover:text-white transition-colors py-1"
              >
                {a.label}
                <span className="absolute left-1/2 -bottom-0.5 h-px w-0 -translate-x-1/2 bg-accent-400 transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
            {routes.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="group relative text-sm font-medium text-primary-200 hover:text-white transition-colors py-1"
              >
                {r.label}
                <span className="absolute left-1/2 -bottom-0.5 h-px w-0 -translate-x-1/2 bg-accent-400 transition-all duration-300 ease-out group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href="#contacto" onClick={(e) => handleAnchorClick(e, '#contacto')}>
              <Button variant="secondary" size="sm" className="gap-1.5 bg-white text-primary-900 hover:bg-cream-100">
                <WhatsAppIcon size={16} />
                Agenda por WhatsApp
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-primary-200 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav: panel sólido a pantalla completa (no empuja el
            contenido inline) — con fondo semitransparente detrás para
            marcar que es una capa modal, no otro tramo de la página. */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed inset-0 top-[68px] z-30 bg-stone-900/20"
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="bg-cream-50 border-b border-stone-200/70 shadow-lifted"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="px-4 py-6 flex flex-col gap-5">
                {anchors.map((a) => (
                  <a
                    key={a.href}
                    href={a.href}
                    onClick={(e) => {
                      setMenuOpen(false)
                      handleAnchorClick(e, a.href)
                    }}
                    className="text-sm font-medium text-stone-600"
                  >
                    {a.label}
                  </a>
                ))}
                {routes.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-stone-600"
                  >
                    {r.label}
                  </Link>
                ))}
                <a href="#contacto" onClick={(e) => {
                  setMenuOpen(false)
                  handleAnchorClick(e, '#contacto')
                }}>
                  <Button variant="primary" className="w-full gap-1.5">
                    <WhatsAppIcon size={17} />
                    Agenda por WhatsApp
                  </Button>
                </a>
              </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </header>
      </div>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer: zona utilitaria, no otra sección de venta — los datos de
          contacto y el CTA de WhatsApp ya viven en la banda de cierre justo
          encima (Landing#contacto). Fondo primary-950 liso (sin grano) con
          un borde superior sutil que lo separa de esa banda (primary-900
          con grano), y menos altura que antes. */}
      <footer id="contacto-footer" className="bg-primary-950 text-primary-100 mt-auto border-t border-primary-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <BrandMark size={30} />
              <span className="font-display italic text-lg font-medium text-white">Felipe Caro</span>
            </div>
            <p className="text-sm text-primary-300 leading-relaxed max-w-xs">
              Acompañamiento psicológico profesional, cercano y confidencial. Un espacio propio para
              conversar con calma.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400 mb-4">
              Navegación
            </h3>
            <ul className="space-y-2 text-sm text-primary-300">
              {anchors.map((a) => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    onClick={(e) => handleAnchorClick(e, a.href)}
                    className="hover:text-white transition-colors"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
              {routes.map((r) => (
                <li key={r.to}>
                  <Link
                    to={r.to}
                    className="hover:text-white transition-colors"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-400 mb-4">
              Contacto
            </h3>
            <ul className="space-y-2 text-sm text-primary-300">
              {FOOTER_CONTACT_LINES.map((line, i) => {
                const Icon = footerContactIcon(line)
                return (
                  <li key={i} className="flex items-start gap-2">
                    <Icon size={14} className="text-primary-500 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-400">
            <span>© {new Date().getFullYear()} Felipe Caro · Todos los derechos reservados</span>
            <span className="tracking-wide">MINEDUC N° 63345 · Reg. Sup. Salud N.º 109.585</span>
          </div>
        </div>
      </footer>

      {/* Burbuja flotante: acceso directo siempre visible, complementa (no
          reemplaza) el formulario de #contacto — para quien no quiere
          bajar hasta ahí ni completar el campo de nombre. */}
      <WhatsAppButton
        phone={WHATSAPP_PHONE}
        message="Hola Felipe, te escribo desde tu sitio web."
        className="bottom-5 right-5 sm:bottom-6 sm:right-6"
      />
    </div>
  )
}
