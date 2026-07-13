import { getDemoAvailability } from './demoAvailability'

// Vista previa visual sin backend: publicAPI no le pega a ningún servidor,
// devuelve datos simulados con la misma forma que espera cada página
// (Landing/Booking/SlotPicker), para validar el diseño con Felipe antes de
// implementar cualquier observación sobre el proyecto real.
export const publicAPI = {
  // Array vacío: mergeContentBlocks (en fallbacks.js) ya rellena todo el
  // copy real del seed cuando no hay bloques del backend — un solo lugar
  // para mantener el contenido, sin duplicarlo acá.
  getContent: () => Promise.resolve({ data: [] }),

  getAvailability: (dateKey) => getDemoAvailability(dateKey),

  book: () =>
    new Promise((resolve) => {
      setTimeout(() => resolve({ data: { status: 'PENDING' } }), 500)
    }),
}
