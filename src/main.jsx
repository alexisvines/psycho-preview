import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/newsreader/wght-italic.css'
import '@fontsource-variable/instrument-sans'
import './index.css'

// Sin esto, el navegador restaura la posición de scroll donde estaba la
// pestaña antes de recargar (comportamiento nativo, no un bug de la app) —
// en una SPA de una sola página larga eso se siente como "se salta a la
// mitad de la página al recargar". Con 'manual', cada carga empieza arriba
// salvo que la URL traiga un hash real (que si Landing.jsx igual resuelve).
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
