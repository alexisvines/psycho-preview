// Contenido de la sección "Escritos": Felipe todavía no define qué publicar
// aquí, así que por ahora son placeholders ("Próximamente"). Cuando mande un
// escrito real, agrégalo como un nuevo objeto en el array de su categoría
// (literarios o psicoanaliticos) y quita el que ya no haga falta — no hay
// que tocar Escritos.jsx ni ningún otro archivo para esto.
//
// Campos de cada escrito:
//   id: número único (no se repite entre categorías)
//   title: título del escrito
//   excerpt: resumen o primer párrafo (2-3 líneas)
//   comingSoon: true mientras sea placeholder; bórralo (o pon false) cuando
//               el texto sea real — así desaparece la etiqueta "Próximamente"
//
// ¿Agregar una categoría nueva (ej. "cuentos")? Dos pasos, ambos acá mismo:
//   1. Agrega la clave al objeto de abajo: cuentos: [ {id: 7, title: ..., excerpt: ..., comingSoon: true} ]
//   2. Agrega su etiqueta de pestaña en ESCRITOS_CATEGORY_LABELS: cuentos: 'Cuentos'
// Escritos.jsx lee ambas listas dinámicamente — no hace falta tocar el
// componente para que la pestaña nueva aparezca.
export const ESCRITOS_CATEGORY_LABELS = {
  literarios: 'Escritos literarios',
  psicoanaliticos: 'Escritos psicoanalíticos',
  // cuentos: 'Cuentos',
}

export const ESCRITOS_CONTENT = {
  literarios: [
    {
      id: 1,
      title: 'Permanentes',
      excerpt: 'Una colección de versos que exploran los temas del tiempo, la memoria y la permanencia en la experiencia humana.',
      comingSoon: true,
    },
    {
      id: 2,
      title: 'Diálogos silenciosos',
      excerpt: 'Reflexiones poéticas sobre el poder terapéutico de la escucha y el espacio compartido entre dos voces.',
      comingSoon: true,
    },
    {
      id: 3,
      title: 'Geografía del sentir',
      excerpt: 'Un recorrido por los paisajes internos que habitamos, entre lo público y lo profundamente privado.',
      comingSoon: true,
    },
  ],
  psicoanaliticos: [
    {
      id: 4,
      title: 'La escucha como acto clínico',
      excerpt: 'Reflexión sobre la escucha profunda en el psicoanálisis: más allá de las palabras, hacia lo que permanece silenciado.',
      comingSoon: true,
    },
    {
      id: 5,
      title: 'Crisis y transformación',
      excerpt: 'Ensayo que explora cómo las crisis personales pueden convertirse en oportunidades de transformación psíquica.',
      comingSoon: true,
    },
    {
      id: 6,
      title: 'Transferencia y encuentro',
      excerpt: 'Análisis de la relación terapéutica como espacio de encuentro auténtico entre dos subjetividades.',
      comingSoon: true,
    },
  ],
}

// Query key para el useQuery de Escritos.jsx.
export const ESCRITOS_QUERY_KEY = ['public-escritos']

// Slug para la URL /escritos/:slug, derivado del título (no hay columna de
// slug en el Sheet: pedirle a Felipe que mantenga un slug a mano por fila
// es fricción extra que no vale la pena para ~6-10 escritos).
function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Igual idea que mergeContentBlocks (fallbacks.js), pero por categoría en
// vez de por sectionKey: si el Sheet trajo items para una categoría, esos
// reemplazan por completo los placeholders locales de esa categoría; si no
// trajo nada (Sheet vacío, sin filas de esa categoría, o fetch fallido),
// esa categoría cae a ESCRITOS_CONTENT sin tocarla.
export function mergeEscritosContent(byCategory) {
  const merged = {}
  for (const category of Object.keys(ESCRITOS_CONTENT)) {
    const fetched = byCategory?.[category]
    const items = fetched?.length > 0 ? fetched : ESCRITOS_CONTENT[category]
    merged[category] = items.map((item) => ({ ...item, slug: slugify(item.title) }))
  }
  return merged
}

// Busca un escrito por slug entre todas las categorías de un objeto ya
// mergeado (mergeEscritosContent) — usado por la página de detalle
// /escritos/:slug, que no sabe a priori de qué categoría es el slug.
export function findEscritoBySlug(mergedByCategory, slug) {
  for (const category of Object.keys(mergedByCategory)) {
    const item = mergedByCategory[category].find((i) => i.slug === slug)
    if (item) return { item, category }
  }
  return null
}
