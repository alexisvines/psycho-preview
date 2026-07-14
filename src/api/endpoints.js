// Vista previa visual sin backend: publicAPI no le pega a ningún servidor,
// devuelve datos simulados con la misma forma que espera cada página.
export const publicAPI = {
  // Array vacío: mergeContentBlocks (en fallbacks.js) ya rellena todo el
  // copy real del seed cuando no hay bloques del backend — un solo lugar
  // para mantener el contenido, sin duplicarlo acá.
  getContent: () => Promise.resolve({ data: [] }),
}
