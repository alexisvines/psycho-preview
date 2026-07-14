import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  CalendarCheck,
  ArrowRight,
  ArrowDown,
  Mail,
  Phone,
  Clock3,
  MapPin,
  Baby,
  UserRound,
  HeartHandshake,
  Sparkles,
  GraduationCap,
  BadgeCheck,
  Star,
  ScrollText,
  Award,
  Linkedin,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon'
import { scrollToAnchor } from '@/lib/scrollToAnchor'
import felipePortrait from '@/assets/felipe-whatsapp.jpg'
import felipeSobre from '@/assets/felipe-sobre.jpg'
import espacio1 from '@/assets/espacio-1.jpg'
import espacio2 from '@/assets/espacio-2.jpg'
import { publicAPI } from '@/api/endpoints'
import { PUBLIC_CONTENT_QUERY_KEY, mergeContentBlocks } from './fallbacks'
import TestimonialsMarquee, { GOOGLE_REVIEWS_URL } from './components/TestimonialsMarquee'
import EvidenceSection from './components/EvidenceSection'
import ApproachSection from './components/ApproachSection'
import WhatsAppCTA from './components/WhatsAppCTA'
import { SectionHeading } from './components/SectionHeading'
import { Button } from '@/components/ui/Button'
import { CardContent } from '@/components/ui/Card'
import { GlowCard } from '@/components/ui/GlowCard'
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import {
  staggerContainer,
  staggerItem,
  wordRevealContainer,
  wordRevealItem,
  sectionReveal,
} from '@/lib/motion'

// Icono por servicio: matching simple por palabra clave en el nombre del
// bloque CMS, con un ícono genérico de respaldo si no calza ninguno (copy
// editable desde el admin, no queremos que un nombre nuevo rompa el ícono).
function serviceIcon(name = '') {
  const key = name.toLowerCase()
  if (key.includes('pareja')) return HeartHandshake
  if (key.includes('adolescen')) return GraduationCap
  if (key.includes('evaluaci') || key.includes('informe')) return ScrollText
  if (key.includes('adultos')) return UserRound
  if (key.includes('psicoanalítica')) return Sparkles
  return Sparkles
}

// Titular del hero, palabra por palabra, con reveal en cascada (fade + y)
// al montar. Peso 600 real (no 500): una serif variable en peso medio a
// tamaño display se ve blanda — el contraste de peso es lo que lee como
// "cuidado", no la itálica ni el efecto de hover.
function HeroHeadline({ text }) {
  const shouldReduceMotion = useReducedMotion()
  const words = text.split(' ')

  return (
    <motion.h1
      className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-stone-900 leading-[1.05] tracking-tight"
      variants={wordRevealContainer(shouldReduceMotion)}
      initial="initial"
      animate="animate"
    >
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <motion.span
            key={i}
            variants={wordRevealItem(shouldReduceMotion)}
            className={`inline-block mr-[0.28em] ${isLast ? 'text-primary-700' : ''}`}
          >
            {word}
          </motion.span>
        )
      })}
    </motion.h1>
  )
}

// Credenciales verificables (Doctoralia + Google), mostradas en la trust
// bar bajo el hero — el detalle que convierte "sitio bonito" en "profesional
// real". Copy fijo (no viene del CMS): son datos verificables, no editoriales.
const CREDENTIALS = [
  { icon: BadgeCheck, label: 'MINEDUC N° 63345' },
  { icon: BadgeCheck, label: 'Registro Superintendencia de Salud N.º 109.585' },
  { icon: HeartHandshake, label: '15+ años de experiencia' },
  { icon: Star, label: '★ 5,0 en Google (44 reseñas)' },
]

// Formación académica, en orden cronológico, para la mini-línea de tiempo
// en la sección "Sobre mí".
// Iconos académicos genéricos (no logos de universidades: son marcas
// registradas y usarlas sin permiso no es buena práctica).
const EDUCATION = [
  { year: '', icon: GraduationCap, label: 'Magíster en Intervención Clínica, Universidad Nacional Andrés Bello' },
  { year: '', icon: ScrollText, label: 'Postítulo en Clínica Psicoanalítica de Adultos, Universidad Diego Portales' },
  { year: '', icon: Award, label: 'Magíster en Psicología, mención Teoría y Clínica Psicoanalítica, Universidad Diego Portales' },
  { year: '', icon: Award, label: 'Diploma Superior y Especialización en Ciencias Sociales, mención Psicoanálisis y Prácticas Socioeducativas, FLACSO Argentina' },
]

// Motivos de consulta frecuentes: chips informativos (no clickeables) que
// dan una idea rápida de cobertura clínica sin sustituir el copy editorial.
const CONSULT_REASONS = [
  'Ansiedad',
  'Depresión',
  'Estrés',
  'Trastornos del ánimo',
  'Angustia',
  'Dificultades adolescentes',
  'TEA / Asperger',
  'Control de impulsos',
]

// Franja de credenciales verificables bajo el hero: sobria, tipografía
// pequeña con tracking amplio (registro "sello institucional", no marketing).
function TrustBar() {
  return (
    <motion.section
      className="border-b border-primary-900/10 bg-cream-100"
      {...sectionReveal}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-7">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5">
          {CREDENTIALS.map(({ icon: Icon, label }, i) => (
            <div key={i} className="flex items-center gap-2.5 min-w-0">
              <Icon size={17} className="text-primary-600 shrink-0" strokeWidth={1.5} />
              <span className="text-[0.7rem] sm:text-xs font-medium uppercase tracking-[0.08em] text-stone-500 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// Icono por línea de contacto: matching por palabra clave (misma idea que
// serviceIcon) en vez de un array posicional, para que el ícono no se
// desalinee si el copy CMS cambia el orden de las líneas.
function contactIcon(line = '') {
  const key = line.toLowerCase()
  if (key.startsWith('dirección') || key.startsWith('direccion')) return MapPin
  if (key.startsWith('teléfono') || key.startsWith('telefono')) return Phone
  if (key.startsWith('horario') || key.startsWith('atención') || key.startsWith('atencion')) return Clock3
  if (key.startsWith('email') || key.startsWith('correo')) return Mail
  return CalendarCheck
}

// Paso de "cómo funciona": número gigante en Fraunces, semi-recortado detrás
// del texto (broken grid), que se "enciende" (opacidad + color) a medida que
// el paso cruza el centro del viewport durante el scroll. Cada paso mide su
// propio progreso de scroll (en vez de derivarlo del contenedor entero) para
// que el efecto de encendido sea preciso por elemento.
function HowItWorksStep({ index, text }) {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'start 0.35'],
  })
  // Piso de opacidad alto (0.55) y arranque en gris-tinta: el "encendido"
  // por scroll es un matiz, nunca debe dejar un paso ilegible.
  const opacity = useTransform(scrollYProgress, [0, 1], [0.55, 1])
  const textColor = useTransform(scrollYProgress, [0, 1], ['#57534e', '#4a5d42'])
  const dotScale = useTransform(scrollYProgress, [0, 1], [0.6, 1])
  const numberOpacity = useTransform(scrollYProgress, [0, 1], [0.25, 0.6])

  return (
    // Número y texto en flujo flex (nada absoluto ni negativo): cada fila
    // contiene su propio número, así que los números no pueden superponerse
    // entre pasos a ningún ancho de pantalla.
    <div ref={ref} className="relative flex items-center gap-8 sm:gap-12 py-7 sm:py-8">
      {/* Número gigante como marca de agua, alineado contra el riel */}
      <motion.span
        aria-hidden="true"
        className="w-20 sm:w-36 shrink-0 text-right select-none font-display text-[3.5rem] sm:text-[5.5rem] font-medium text-primary-300 leading-none"
        style={{ opacity: shouldReduceMotion ? 0.45 : numberOpacity }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>
      {/* Punto sobre la línea vertical, centrado con el paso */}
      <motion.span
        aria-hidden="true"
        className="absolute left-24 sm:left-[10.5rem] top-1/2 h-2.5 w-2.5 rounded-full bg-primary-600 -translate-x-1/2 -translate-y-1/2"
        style={shouldReduceMotion ? undefined : { scale: dotScale }}
      />
      <motion.p
        className="flex-1 text-lg sm:text-xl text-stone-700 leading-relaxed"
        style={shouldReduceMotion ? undefined : { opacity, color: textColor }}
      >
        {text}
      </motion.p>
    </div>
  )
}

// Sección completa de "cómo funciona": la línea vertical de fondo se dibuja
// (scaleY 0 → 1, origen arriba) según el progreso de scroll del bloque de
// pasos completo, mientras cada HowItWorksStep enciende su propio texto de
// forma independiente. Con prefers-reduced-motion todo queda visible y
// estático (línea completa, sin encendido progresivo).
function HowItWorksSection({ title, steps }) {
  const containerRef = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.4'],
  })
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.section
      id="como-funciona"
      className="bg-cream-100 border-y border-primary-900/10 scroll-mt-20"
      {...sectionReveal}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <div className="mb-16">
          <SectionHeading label="Proceso" align="center">{title}</SectionHeading>
        </div>
        <div ref={containerRef} className="relative">
          {/* Riel de la línea (siempre visible, tenue), entre número y texto */}
          <div
            aria-hidden="true"
            className="absolute left-24 sm:left-[10.5rem] top-2 bottom-2 w-px bg-primary-200"
          />
          {/* Línea "dibujada" por el scroll */}
          <motion.div
            aria-hidden="true"
            className="absolute left-24 sm:left-[10.5rem] top-2 bottom-2 w-px bg-primary-600 origin-top"
            style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: lineScaleY }}
          />
          <div className="relative">
            {steps.map((step, i) => (
              <HowItWorksStep key={i} index={i} text={step} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}

// "El espacio": dos fotos del consultorio en composición asimétrica editorial
// (una más grande, offsets verticales), con un parallax muy sutil sobre la
// foto grande atado al scroll de la sección. Copy corto, sin depender del
// CMS (es texto ambiental, no editable desde el admin).
function ElEspacio() {
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-24, 24])

  return (
    <motion.section
      ref={ref}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24"
      {...sectionReveal}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <SectionHeading label="El espacio" className="mb-4">
            El espacio
          </SectionHeading>
          <p className="text-base text-stone-700 leading-relaxed max-w-sm">
            Una consulta privada y tranquila, con luz natural. Sin salas de
            espera compartidas ni interrupciones: solo un espacio cómodo para
            conversar con calma y en total confidencialidad.
          </p>
          <p className="mt-4 text-sm text-stone-500 max-w-sm">
            Lautaro 1775 C, oficina N°3, Barrancas, San Antonio, Chile.
          </p>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 relative grid grid-cols-5 gap-4 sm:gap-5">
          <motion.div
            className="col-span-3 relative"
            style={shouldReduceMotion ? undefined : { y: parallaxY }}
          >
            <div className="group relative rounded-2xl overflow-hidden shadow-[0_16px_48px_-12px_rgba(38,72,60,0.35)] transition-shadow duration-500 hover:shadow-[0_22px_60px_-12px_rgba(38,72,60,0.45)]">
              <img
                src={espacio1}
                alt="Diván y sillón de la consulta de Felipe Caro, con luz cálida y plantas"
                width={1400}
                height={1050}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                style={{ filter: 'saturate(0.8) sepia(0.15)' }}
              />
              {/* Tint arena muy leve, unifica el amarillo saturado de las
                  paredes reales con la paleta cálida del sitio. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{ background: '#d9c9a8', opacity: 0.1 }}
              />
            </div>
          </motion.div>
          <div className="col-span-2 relative mt-10 sm:mt-16">
            <div className="group relative rounded-2xl overflow-hidden shadow-[0_16px_48px_-12px_rgba(38,72,60,0.35)] transition-shadow duration-500 hover:shadow-[0_22px_60px_-12px_rgba(38,72,60,0.45)]">
              <img
                src={espacio2}
                alt="Rincón acogedor del consultorio, con plantas y luz natural"
                width={1400}
                height={905}
                loading="lazy"
                className="w-full aspect-[1400/905] object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                style={{ filter: 'saturate(0.8) sepia(0.15)' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{ background: '#d9c9a8', opacity: 0.1 }}
              />
            </div>
          </div>

          {/* TODO: add espacio-3.jpg / espacio-4.jpg once Felipe sends final photo files
          <div className="col-span-2 relative mt-10 sm:mt-16">
            <div className="group relative rounded-2xl overflow-hidden shadow-[0_16px_48px_-12px_rgba(38,72,60,0.35)] transition-shadow duration-500 hover:shadow-[0_22px_60px_-12px_rgba(38,72,60,0.45)]">
              <img
                src={espacio3}
                alt="Detalle del consultorio"
                width={1400}
                height={905}
                loading="lazy"
                className="w-full aspect-[1400/905] object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                style={{ filter: 'saturate(0.8) sepia(0.15)' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{ background: '#d9c9a8', opacity: 0.1 }}
              />
            </div>
          </div>

          <div className="col-span-2 relative mt-10 sm:mt-16">
            <div className="group relative rounded-2xl overflow-hidden shadow-[0_16px_48px_-12px_rgba(38,72,60,0.35)] transition-shadow duration-500 hover:shadow-[0_22px_60px_-12px_rgba(38,72,60,0.45)]">
              <img
                src={espacio4}
                alt="Otro ángulo del consultorio"
                width={1400}
                height={905}
                loading="lazy"
                className="w-full aspect-[1400/905] object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                style={{ filter: 'saturate(0.8) sepia(0.15)' }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 mix-blend-multiply pointer-events-none"
                style={{ background: '#d9c9a8', opacity: 0.1 }}
              />
            </div>
          </div>
          */}
        </div>
      </div>
    </motion.section>
  )
}

export default function Landing() {
  const location = useLocation()
  const navigate = useNavigate()
  // Motivo pre-seleccionado al hacer clic en "Agendar" desde una card de
  // Servicios — viaja calladamente hasta el formulario de WhatsApp en
  // #contacto, sin pedirle nada más a la persona.
  const [selectedService, setSelectedService] = useState(null)
  const { data: blocks, isLoading } = useQuery({
    queryKey: PUBLIC_CONTENT_QUERY_KEY,
    queryFn: () => publicAPI.getContent(),
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000,
  })

  // El merge con FALLBACKS asegura que la landing nunca se vea vacía,
  // incluso mientras `isLoading` o si /public/content falla.
  const content = mergeContentBlocks(blocks)

  // Navegación a un ancla desde otra ruta (ej. "/escritos" → "/#psicoanalisis"):
  // Lenis vive en PublicLayout y no expone su instancia acá, así que
  // resolvemos el salto con scrollIntoView nativo — Lenis lo recoge en su
  // siguiente frame de RAF sin conflicto.
  // Importante: el hash se "consume" y se limpia de la URL después de
  // saltar (navigate con replace, sin dejar entrada nueva en el historial)
  // — si no, queda pegado permanentemente (ej. ".../#/#sobre-mi") y CADA
  // recarga futura vuelve a saltar ahí en vez de abrir en el tope.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
    navigate(location.pathname, { replace: true })
    // Solo al cambiar el hash (ej. al montar la landing con uno ya presente).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.hash])

  const heroParagraphs = content.hero.body.split('\n').filter(Boolean)
  const aboutParagraphs = content.about.body.split('\n').filter(Boolean)
  const services = content.services.items
  const steps = content.how_it_works.body.split('\n').filter(Boolean)
  const contactLines = content.contact.body.split('\n').filter(Boolean)

  return (
    <div className={isLoading ? 'opacity-90' : ''}>
      {/* Hero: titular editorial a la izquierda, placa de retrato rectangular
          montada sobre un panel de color sólido a la derecha (bloque real,
          no atmósfera difusa). */}
      <section className="relative overflow-x-hidden border-b border-primary-900/10">
        {/* Bloque de color real (no atmósfera difusa): panel oscuro que
            ocupa el 42% derecho en desktop — el primer viewport ya tiene
            cuerpo de color, no solo detalle sobre papel casi blanco. */}
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[42%] bg-primary-800 hidden lg:block" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Columna de texto */}
            <div className="lg:col-span-7 lg:pr-4">
              <HeroHeadline text={content.hero.title} />

              <motion.div
                className="mt-4 mb-7 max-w-xl"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.4 }}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                  Consultorio de atención psicológica — Felipe Caro Díaz, psicólogo clínico de orientación psicoanalítica
                </span>
              </motion.div>

              <motion.div
                className="mt-7 max-w-xl space-y-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {heroParagraphs.map((p, i) => (
                  <p key={i} className="text-lg text-stone-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </motion.div>

              <motion.div
                className="mt-10 flex flex-wrap items-center gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.4 }}
              >
                <a href="#contacto" onClick={(e) => scrollToAnchor(e, '#contacto')}>
                  <motion.span
                    className="inline-flex"
                    whileHover={{ scale: 1.035 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  >
                    <Button variant="primary" size="lg" className="gap-2">
                      <WhatsAppIcon size={19} />
                      Agenda por WhatsApp
                    </Button>
                  </motion.span>
                </a>
                <a href="#sobre-mi" onClick={(e) => scrollToAnchor(e, '#sobre-mi')}>
                  <Button variant="ghost" size="lg" className="gap-1.5 text-primary-700 hover:bg-primary-50">
                    Conocer más <ArrowDown size={16} />
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Placa editorial (rectángulo, no blob) montada a caballo sobre
                el borde del panel de color. Foto: felipeSobre (sentado en el
                diván, mano en el mentón — pose de escucha), no el selfie
                frontal de antes. Duotono real: grayscale + capa mix-blend-color
                que lee --color-primary-700 + un lavado cálido tenue en
                soft-light + grano SOLO dentro del marco. */}
            <motion.div
              className="lg:col-span-5 flex flex-col items-center lg:items-start relative z-10 lg:pl-4"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative w-[17rem] sm:w-[20rem] lg:w-[21rem] aspect-[4/5] rounded-xl overflow-hidden shadow-lifted ring-1 ring-inset ring-white/15">
                <img
                  src={felipeSobre}
                  alt="Felipe Caro en su consulta"
                  width={768}
                  height={960}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: '50% 20%',
                    filter: 'grayscale(1) contrast(1.08) brightness(1.03)',
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-color"
                  style={{ background: 'rgb(var(--color-primary-700))', opacity: 0.85 }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                  style={{ background: 'rgb(var(--color-accent-400))', opacity: 0.18 }}
                />
                <GrainOverlay opacity={0.07} blend="overlay" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* About: composición editorial asimétrica 5/7, foto real de Felipe en
          su consulta con marco editorial (esquinas generosas, leve rotación),
          seguida de una mini-línea de formación académica y chips de motivos
          de consulta frecuentes. */}
      <motion.section id="sobre-mi" className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 scroll-mt-20 overflow-hidden" {...sectionReveal}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 lg:col-span-5 relative flex justify-center lg:justify-start">
            {/* Retrato de autor, chico y honesto (no el hero): mismo tratamiento
                duotono que la placa del hero, para que se sientan la misma
                marca. Foto nueva (luz de ventana, sin elementos raros de
                fondo) — reemplaza al selfie viejo con póster de Freud. */}
            <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden shadow-lifted ring-1 ring-inset ring-white/15">
              <img
                src={felipePortrait}
                alt="Retrato de Felipe Caro, psicólogo clínico"
                width={640}
                height={642}
                loading="lazy"
                className="h-full w-full object-cover"
                style={{
                  objectPosition: '50% 10%',
                  filter: 'grayscale(1) contrast(1.08) brightness(1.03)',
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-color"
                style={{ background: 'rgb(var(--color-primary-700))', opacity: 0.85 }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                style={{ background: 'rgb(var(--color-accent-400))', opacity: 0.18 }}
              />
              <GrainOverlay opacity={0.07} blend="overlay" />
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <SectionHeading label="Sobre mí" className="mb-7">
              {content.about.title}
            </SectionHeading>
            {/* Primer párrafo como "lead" editorial (más grande y oscuro),
                el resto en registro normal — da jerarquía sin tocar el copy
                del CMS. */}
            <div className="space-y-5 max-w-prose">
              {aboutParagraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'text-xl sm:text-2xl text-stone-800 leading-relaxed font-display'
                      : 'text-lg text-stone-600 leading-loose'
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Acento poético: movido acá desde el hero — en la primera
                pantalla desconcertaba a quien llega buscando ayuda ("no sabe
                qué hacer con un verso hermético"); acá, dentro de "Sobre mí",
                es contexto biográfico legítimo sobre su faceta de escritor. */}
            <div className="mt-6 max-w-prose">
              <span aria-hidden="true" className="block h-px w-10 bg-accent-400/60 mb-4" />
              <p className="font-display italic text-lg text-stone-700 leading-snug">
                «Que los puertos rojos inunden las vidas»
              </p>
              <span className="block not-italic text-sm text-stone-400 mt-2">— Felipe Caro</span>
            </div>

            {/* Formación: línea de tiempo vertical compacta */}
            <div className="mt-10 max-w-prose">
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-400 mb-4">
                Formación
              </h3>
              <ol className="relative border-l border-primary-200 pl-8 space-y-5">
                {EDUCATION.map(({ year, icon: Icon, label }, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[2.05rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 border border-primary-200 text-primary-700 ring-4 ring-cream-50">
                      <Icon size={14} strokeWidth={1.5} />
                    </span>
                    <span className="block text-sm text-stone-700 leading-snug pt-1">
                      <span className="font-medium text-stone-900">{year}</span> — {label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Motivos de consulta frecuentes: chips informativos */}
            <div className="mt-8 flex flex-wrap gap-2 max-w-prose">
              {CONSULT_REASONS.map((reason) => (
                <span
                  key={reason}
                  className="text-xs font-medium text-primary-700/90 bg-primary-50/80 rounded-full px-2.5 py-1"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <ElEspacio />

      {/* Enfoque: "¿Qué es el psicoanálisis?" — entre "El espacio" y
          "Evidencia", para que el hilo narrativo fluya: conocer a Felipe →
          entender su enfoque → ver la evidencia. Bloque CMS `approach`. */}
      <ApproachSection title={content.approach.title} body={content.approach.body} />

      {/* Evidencia: por qué consultar, con datos verificados (OMS + eficacia
          de la psicoterapia). Bloque CMS `evidence`, entre "El enfoque" y
          "Servicios". */}
      <EvidenceSection title={content.evidence.title} body={content.evidence.body} />

      {/* Services: terapia infanto-juvenil como servicio estrella, más
          adultos y orientación a padres. Cards con hover premium (elevación
          + borde salvia + micro-scale) y formas orgánicas. */}
      <motion.section id="servicios" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 scroll-mt-20" {...sectionReveal}>
        <div className="mb-12">
          <SectionHeading label="Servicios" align="center">{content.services.title}</SectionHeading>
          <p className="text-stone-600 mt-3 text-center">Un espacio pensado para cada etapa de la vida</p>
        </div>
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }}>
          <BentoGrid>
            {services.map((service, i) => {
              const Icon = serviceIcon(service.name)
              return (
                <BentoCard key={i}>
                  <motion.div
                    variants={staggerItem}
                    className="h-full"
                    whileHover={{ y: -6, scale: 1.015, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  >
                    <GlowCard className="h-full border-transparent hover:border-primary-200 transition-colors duration-300">
                      <CardContent className="p-7 h-full flex flex-col">
                        <div
                          className="h-12 w-12 flex items-center justify-center text-primary-700 bg-primary-50 mb-5"
                          style={{ borderRadius: '46% 54% 58% 42% / 50% 44% 56% 50%' }}
                        >
                          <Icon size={22} strokeWidth={1.75} />
                        </div>
                        <h3 className="font-display text-xl font-medium text-stone-900 mb-2">{service.name}</h3>
                        <span className="text-xs font-semibold uppercase tracking-wide text-accent-700 mb-1 block">{service.price}</span>
                        <p className="text-stone-600 text-sm leading-relaxed flex-1">{service.description}</p>
                        {/* En vez de abrir WhatsApp directo, guarda el motivo
                            y lleva al formulario de #contacto — así el
                            mensaje final lleva nombre + motivo juntos, no
                            dos mensajes separados. */}
                        <a
                          href="#contacto"
                          onClick={(e) => {
                            setSelectedService(service.name)
                            scrollToAnchor(e, '#contacto')
                          }}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
                        >
                          <WhatsAppIcon size={14} />
                          Agendar <ArrowRight size={14} />
                        </a>
                      </CardContent>
                    </GlowCard>
                  </motion.div>
                </BentoCard>
              )
            })}
          </BentoGrid>
        </motion.div>
      </motion.section>

      {/* How it works: scrollytelling — línea vertical que se "dibuja" con
          scaleY atado al progreso de scroll del contenedor, pasos numerados
          gigantes en Fraunces que se encienden al pasar. */}
      <HowItWorksSection title={content.how_it_works.title} steps={steps} />

      {/* Testimonios: parseados del bloque CMS `testimonials`. */}
      <TestimonialsMarquee title={content.testimonials.title} body={content.testimonials.body} />

      {/* Banda de cierre: única llamada final a la acción de la landing.
          Reemplaza la antigua sección "Contacto" (que duplicaba el footer:
          misma columna de datos + un segundo botón "Reservar hora"). Fondo
          salvia muy profundo con grano + un lavado de acuarela oscuro apenas
          perceptible, para que el crema/terracota del CTA contraste de
          verdad (nada de salvia sobre salvia). Los datos de contacto quedan
          como una línea compacta bajo el botón, no como otra sección de
          venta — esa es ahora la única fuente de esos datos junto al footer. */}
      <motion.section
        id="contacto"
        className="relative overflow-hidden bg-primary-900 scroll-mt-20"
        {...sectionReveal}
      >
        <div
          aria-hidden="true"
          className="absolute -top-[20%] left-[10%] h-[70%] w-[70%] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, #1c2318 0%, transparent 70%)', opacity: 0.5 }}
        />
        <GrainOverlay opacity={0.06} blend="overlay" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-primary-300 mb-4">
              Empieza hoy
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-medium text-cream-50 leading-[1.1] tracking-tight mb-4">
              {content.contact.title || '¿Listo para empezar tu proceso?'}
            </h2>
            <p className="text-lg text-primary-200 max-w-xl mx-auto mb-10">
              Cuéntanos tu nombre y nos comunicaremos por WhatsApp.
            </p>

            <div className="max-w-md mx-auto mb-10">
              <WhatsAppCTA service={selectedService} />
            </div>

            {/* Datos de contacto: línea compacta, no otra sección — el
                footer inmediatamente debajo ya no los repite. */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {contactLines.map((line, i) => {
                const Icon = contactIcon(line)
                return (
                  <span key={i} className="inline-flex items-center gap-2 text-sm text-primary-200">
                    <Icon size={15} className="text-primary-400 shrink-0" />
                    {line}
                  </span>
                )
              })}
              <a
                href="https://www.linkedin.com/in/felipecarodiaz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary-200 hover:text-primary-100 transition-colors"
              >
                <Linkedin size={15} className="text-primary-400 shrink-0" />
                LinkedIn
              </a>
            </div>

            {/* Mapa: Google Maps embed sin API key no permite estilos custom
                (eso requiere Maps JavaScript API + Map ID), así que el
                embed básico trae sus colores saturados de siempre — un
                filtro CSS (grayscale + tinte navy vía sepia/hue-rotate)
                lo acerca a la paleta del sitio, mismo truco que ya usan
                los retratos (saturate/sepia) para el look duotono.
                Un iframe por sí solo no "lleva a ningún lado" al hacer
                clic — se le pone un overlay clickeable encima (el iframe
                queda pointer-events:none) que abre la ficha real de Google
                Maps del consultorio en una pestaña nueva. */}
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-12 max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lifted block"
              aria-label="Abrir la ubicación del consultorio en Google Maps"
            >
              <iframe
                src="https://www.google.com/maps?q=-33.5956188,-71.6106921&output=embed"
                title="Ubicación consulta"
                loading="lazy"
                width="100%"
                height="250"
                style={{
                  border: 0,
                  pointerEvents: 'none',
                  filter: 'grayscale(0.85) sepia(0.35) hue-rotate(175deg) saturate(1.8) brightness(0.92) contrast(1.05)',
                }}
                aria-hidden="true"
                tabIndex="-1"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-primary-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pb-4">
                <span className="text-sm font-medium text-white inline-flex items-center gap-1.5">
                  Abrir en Google Maps <ArrowRight size={14} />
                </span>
              </div>
            </a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
