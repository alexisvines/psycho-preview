import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { BrandMark } from './ui/BrandMark'
import { Button } from './ui/Button'
import { WhatsAppButton } from './ui/WhatsAppButton'
import { useTheme } from '@/context/ThemeContext'
import { pageVariants } from '@/lib/motion'

const anchors = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'El enfoque', href: '#psicoanalisis' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Contacto', href: '#contacto' },
]

// Mismo teléfono que la línea de contacto (fallbacks.js) — fijo acá, no
// viene del CMS, mismo criterio que GOOGLE_REVIEWS_URL en
// TestimonialsMarquee.jsx.
const WHATSAPP_PHONE = '+56 9 5407 2852'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isLanding = location.pathname === '/'
  const lenisRef = useRef(null)
  const { logoVariant, mode, toggleMode } = useTheme()

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
          no tiene login ni panel admin, solo landing + reserva. */}
      <div className="sticky top-0 z-40">
        {/* Header: glassmorphism real (blur + fondo semitransparente + borde
            inferior sutil) una vez que se hizo scroll; transparente sobre el
            hero para no competir con su panel de color. */}
        <header
          className={`transition-[background-color,backdrop-filter,border-color] duration-300 ${
            scrolled
              ? 'bg-cream-50/75 backdrop-blur-xl border-b border-stone-200/70 shadow-[0_1px_0_rgba(0,0,0,0.02)]'
              : 'bg-cream-50/0 border-b border-transparent'
          }`}
        >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <BrandMark size={34} interactive variant={logoVariant} />
            {/* El wordmark "fecard" ya dice el nombre — repetirlo al lado
                sería redundante (y competiría con su propia caligrafía). */}
            {logoVariant === 'fecard' ? (
              <span className="hidden sm:inline not-italic text-xs font-sans tracking-[0.18em] uppercase text-primary-700 dark:text-primary-300 align-middle">
                Psicólogo
              </span>
            ) : (
              <span className="font-display italic text-xl text-stone-900 leading-tight">
                Felipe Caro{' '}
                <span className="hidden sm:inline not-italic text-xs font-sans tracking-[0.18em] uppercase text-primary-700 dark:text-primary-300 align-middle ml-1">
                  Psicólogo
                </span>
              </span>
            )}
          </Link>

          {/* Desktop nav: subrayado animado on hover/focus (crece desde el centro) */}
          <nav className="hidden md:flex items-center gap-8">
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                onClick={(e) => handleAnchorClick(e, a.href)}
                className="group relative text-sm font-medium text-stone-600 hover:text-primary-700 dark:hover:text-primary-300 transition-colors py-1"
              >
                {a.label}
                <span className="absolute left-1/2 -bottom-0.5 h-px w-0 -translate-x-1/2 bg-primary-600 transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleMode}
              className="p-2 rounded-lg text-stone-500 hover:text-primary-700 hover:bg-stone-100 transition-colors"
              aria-label={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden md:block">
              <Link to="/reservar">
                <Button variant="outline" size="sm">Reservar hora</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-stone-200/70"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
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
                <Link to="/reservar" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Reservar hora</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </header>
      </div>

      {/* Page content: cortinilla breve entre Landing y Reservar — antes el
          cambio de ruta era un corte seco; con AnimatePresence + pageVariants
          (ya definido en lib/motion.js pero sin usar) hay una continuidad
          visual mínima, coherente con el resto del motion del sitio. */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer: zona utilitaria, no otra sección de venta — los datos de
          contacto y el CTA de reservar ya viven en la banda de cierre justo
          encima (Landing#contacto). Fondo primary-950 liso (sin grano) con
          un borde superior sutil que lo separa de esa banda (primary-900
          con grano), y menos altura que antes. */}
      <footer id="contacto-footer" className="bg-primary-950 text-primary-100 mt-auto border-t border-primary-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <BrandMark size={30} tone="negative" variant={logoVariant} />
              {logoVariant !== 'fecard' && (
                <span className="font-display italic text-lg font-medium text-white">Felipe Caro</span>
              )}
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
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-400">
            <span>© {new Date().getFullYear()} Felipe Caro · Todos los derechos reservados</span>
            <span className="tracking-wide">Psicólogo Colegiado N° 63345</span>
          </div>
        </div>
      </footer>

      {/* Solo en el landing: en /reservar la barra de "Continuar" queda
          sticky al fondo en mobile, y un botón flotante ahí competiría con
          ella (mismo tipo de choque que el bug de "El espacio"/wizard ya
          corregido) — además, en medio de la reserva no conviene ofrecer
          una salida alternativa. */}
      {isLanding && (
        <WhatsAppButton phone={WHATSAPP_PHONE} message="Hola Felipe, te escribo desde tu sitio web." className="bottom-5 right-5 sm:bottom-6 sm:right-6" />
      )}
    </div>
  )
}
