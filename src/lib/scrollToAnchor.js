// Salto a un ancla in-page (#servicios, #contacto, etc.) que funciona bien
// junto a Lenis (smooth scroll): usar scrollIntoView nativo en vez de dejar
// que el navegador haga el salto por defecto — un <a href="#x"> plano no
// siempre anima bien con Lenis activo. Mismo truco que ya usa Landing.jsx
// para resolver el hash al entrar desde otra ruta.
export function scrollToAnchor(e, href) {
  const el = document.querySelector(href)
  if (!el) return
  e.preventDefault()
  requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}
