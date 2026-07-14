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
