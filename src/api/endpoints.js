import Papa from 'papaparse'

// Sin backend: publicAPI lee servicios de una Google Sheet publicada como CSV
// (si VITE_SERVICES_SHEET_CSV_URL está configurada) y el resto del contenido
// sigue viniendo de FALLBACKS vía mergeContentBlocks (fallbacks.js).
const SERVICES_SHEET_CSV_URL = import.meta.env.VITE_SERVICES_SHEET_CSV_URL
const ESCRITOS_SHEET_CSV_URL = import.meta.env.VITE_ESCRITOS_SHEET_CSV_URL

async function fetchServicesBlock() {
  if (!SERVICES_SHEET_CSV_URL) return null
  try {
    const res = await fetch(SERVICES_SHEET_CSV_URL)
    if (!res.ok) throw new Error(`sheet fetch failed: ${res.status}`)
    const csvText = await res.text()
    const { data: rows } = Papa.parse(csvText, { header: true, skipEmptyLines: true })
    const items = rows
      .filter((row) => row.activo?.trim().toUpperCase() !== 'FALSE')
      .map((row) => ({
        name: row.nombre?.trim(),
        price: row.precio?.trim(),
        description: row.descripcion?.trim(),
      }))
      .filter((item) => item.name && item.price && item.description)
    if (items.length === 0) return null
    return { sectionKey: 'services', title: 'Servicios', items }
  } catch (err) {
    // mergeContentBlocks cae íntegro a FALLBACKS.services si no hay bloque real.
    console.error('No se pudo cargar servicios desde Google Sheets, usando fallback local.', err)
    return null
  }
}

// Igual patrón que fetchServicesBlock, pero agrupado por categoría (nombre
// en minúscula) para calzar con el shape de ESCRITOS_CONTENT en
// escritosContent.js. Filas con estado "Borrador" se excluyen del todo
// (ni siquiera aparecen como "Próximamente" en el sitio).
async function fetchEscritosBlock() {
  if (!ESCRITOS_SHEET_CSV_URL) return null
  try {
    const res = await fetch(ESCRITOS_SHEET_CSV_URL)
    if (!res.ok) throw new Error(`sheet fetch failed: ${res.status}`)
    const csvText = await res.text()
    const { data: rows } = Papa.parse(csvText, { header: true, skipEmptyLines: true })
    const byCategory = {}
    for (const row of rows) {
      const estado = row.estado?.trim().toLowerCase()
      const categoria = row.categoria?.trim().toLowerCase()
      const title = row.titulo?.trim()
      const excerpt = row.resumen?.trim()
      if (!estado || estado === 'borrador' || !categoria || !title || !excerpt) continue
      byCategory[categoria] ??= []
      byCategory[categoria].push({
        title,
        excerpt,
        comingSoon: estado !== 'publicado',
        docUrl: row['link doc']?.trim() || null,
      })
    }
    return Object.keys(byCategory).length > 0 ? byCategory : null
  } catch (err) {
    // mergeEscritosContent cae íntegro a ESCRITOS_CONTENT si no hay bloque real.
    console.error('No se pudo cargar escritos desde Google Sheets, usando fallback local.', err)
    return null
  }
}

// docUrl es el link normal de "Compartir" de un Google Doc (con acceso
// "Cualquier usuario con el enlace: Lector"), no un link de "Publicar en la
// web" — le pedimos a Felipe el link que ya conoce de compartir, y acá se
// arma la URL de exportación a texto plano a partir del ID del documento.
function extractGoogleDocId(url) {
  const match = url?.match(/\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

async function fetchEscritoDocText(docUrl) {
  const docId = extractGoogleDocId(docUrl)
  if (!docId) return null
  try {
    const res = await fetch(`https://docs.google.com/document/d/${docId}/export?format=txt`)
    if (!res.ok) throw new Error(`doc fetch failed: ${res.status}`)
    return await res.text()
  } catch (err) {
    console.error('No se pudo cargar el texto del escrito desde Google Docs.', err)
    return null
  }
}

export const publicAPI = {
  getContent: async () => {
    const servicesBlock = await fetchServicesBlock()
    return { data: servicesBlock ? [servicesBlock] : [] }
  },
  getEscritos: async () => fetchEscritosBlock(),
  getEscritoDocText: async (docUrl) => fetchEscritoDocText(docUrl),
}
