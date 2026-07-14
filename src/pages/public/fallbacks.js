// Copy de respaldo para la landing pública: mismo contenido del seed
// (DataInitializer, backend) para que la página nunca se renderice vacía
// mientras carga /public/content o si el backend no responde.
// sectionKey -> { title, body } (mismo shape que ContentBlockResponse).
export const FALLBACKS = {
  hero: {
    title: 'Un espacio propio para habitar lo que sientes',
    body: 'Acompañamiento psicológico clínico, cercano y confidencial.\nAgenda tu primera sesión en minutos, sin llamadas ni esperas.',
  },
  about: {
    title: 'Sobre Felipe Caro',
    body: 'Soy psicólogo clínico, oriundo de Rancagua, especializado en psicoanálisis, y atiendo en mi consultorio en Barrancas, San Antonio.\nTrabajo también como psicólogo escolar en el Colegio Instituto del Puerto de San Antonio, lo que me ha dado una experiencia amplia acompañando a niños, adolescentes y adultos en distintas etapas de su vida.\nSoy además escritor y participo en un taller literario: es una faceta que mantuve reservada por casi veintiséis años y que solo comencé a compartir a fines de 2019. Creo que escuchar con atención — a un verso o a una persona — es la misma disciplina. La terapia, para mí, es un espacio propio, sin jerga ni juicios, donde pensarte con calma.',
  },
  services: {
    title: 'Servicios',
    items: [
      {
        name: 'Psicoterapia de orientación psicoanalítica',
        price: 'Desde $35.398',
        description: 'Atención psicoterapéutica individual para adolescentes y adultos, orientada a comprender el malestar emocional, los conflictos vinculares, la ansiedad, la tristeza, los duelos y las crisis personales desde una perspectiva clínica profunda y respetuosa del proceso subjetivo.',
      },
      {
        name: 'Psicoterapia para adolescentes',
        price: 'Desde $35.398',
        description: 'Acompañamiento clínico dirigido a adolescentes que presentan dificultades emocionales, ansiedad, desmotivación, conflictos familiares, problemas vinculares, crisis escolares o procesos de adaptación. Se articula trabajo con familia y colegio.',
      },
      {
        name: 'Psicoterapia para adultos',
        price: 'Desde $35.398',
        description: 'Espacio clínico individual para abordar ansiedad, síntomas depresivos, conflictos relacionales, crisis vitales, duelos, estrés, dificultades laborales o problemáticas familiares, desde una orientación psicoanalítica y con resguardo de la confidencialidad.',
      },
      {
        name: 'Terapia de pareja',
        price: 'Desde $46.000',
        description: 'Atención orientada a parejas que atraviesan conflictos vinculares, dificultades de comunicación, crisis afectivas, celos, distanciamiento emocional o procesos de separación. El trabajo busca favorecer la comprensión del conflicto y mejorar los modos de relación.',
      },
      {
        name: 'Evaluación psicológica clínica',
        price: 'Desde $80.000',
        description: 'Proceso de evaluación mediante entrevistas clínicas e instrumentos psicológicos, orientado a comprender el funcionamiento emocional, vincular y adaptativo de la persona. Puede incluir informe psicológico según requerimiento.',
      },
      {
        name: 'Informes psicológicos clínicos',
        price: 'Desde $80.000',
        description: 'Elaboración de informes psicológicos para fines clínicos, laborales, médicos o institucionales, sustentados en entrevistas, antecedentes relevantes y análisis profesional del estado psicológico actual.',
      },
    ],
  },
  how_it_works: {
    title: '¿Cómo funciona?',
    body: 'Elige un horario disponible que te acomode.\nCompleta tus datos y confirma tu cita por email.\nAsiste a tu primera sesión y comienza tu proceso.',
  },
  evidence: {
    title: 'Cuidar tu salud mental importa',
    body: '1 de cada 8 — personas en el mundo vive con un trastorno de salud mental. Consultar no es una rareza: es cuidarse. (Fuente: OMS — Informe Mundial de Salud Mental, 2022)\nPrincipal causa — La depresión y la ansiedad están entre las principales causas de discapacidad a nivel mundial. Atenderlas a tiempo cambia trayectorias de vida. (Fuente: OMS — Informe Mundial de Salud Mental, 2022)\nLa terapia funciona — Décadas de investigación lo confirman: en promedio, quien completa un proceso psicoterapéutico termina mejor que el 80% de quienes no consultan. (Fuente: Wampold & Imel, The Great Psychotherapy Debate, 2015 · APA, 2012)\nQué puedes esperar — Las primeras sesiones son para conocerse: entender qué te trae y definir juntos un rumbo. Los avances son graduales, a tu ritmo, y todo lo conversado es estrictamente confidencial.',
  },
  approach: {
    title: '¿Qué es el psicoanálisis?',
    body: 'Un espacio de palabra — El psicoanálisis es una terapia basada en la escucha profunda: un espacio para hablar libremente, donde lo que te pasa puede decirse sin juicio. No se queda solo en el síntoma: explora su historia y sus causas.\n¿En qué se diferencia? — Existen muchas corrientes válidas. Algunas, como la terapia cognitivo-conductual, trabajan principalmente sobre el síntoma, con técnicas y plazos breves. El psicoanálisis va al fondo: entiende que lo que hoy duele tiene raíces, y que comprenderlas produce cambios más profundos y duraderos.\n¿Es para mí? — Si sientes que lo que te ocurre se repite, que ya intentaste ponerle voluntad y no basta, o simplemente necesitas un espacio propio para pensarte, este enfoque puede acomodarte.\nLa primera consulta lo aclara — No necesitas saberlo de antemano: la primera consulta sirve exactamente para eso. Evaluamos juntos qué te trae y si este enfoque es el indicado para ti — y si no lo es, Felipe te orienta hacia la alternativa adecuada.',
  },
  testimonials: {
    title: 'Lo que dicen sus pacientes',
    body: 'Camila Salinas — Felipe es un excelente profesional, es amable y logra abordar las problemáticas de forma muy asertiva y cercana. Creo que ha sido la mejor experiencia que he tenido con psicólogo y que he mejorado mucho gracias a sus sesiones.\nAntonia González — Llegamos a Felipe con mi hijo adolescente bastante complicado, después de una larga peregrinación por varios psicólogos que mi hijo no deseaba ver. La dedicación, paciencia, cariño, profesionalismo y perseverancia de Felipe fueron claves.\nEvelyn Huerta — Nos ayudó a superar momentos muy difíciles; sin su ayuda no hubiera sido posible. Ya sea un adulto, niño o adolescente, no duden en tomar atención con él.\nMaría Fernanda Rodríguez — Felipe es un excelente profesional que desde un comienzo genera confianza. Me ha ayudado un montón en mi proceso y lo recomiendo 100%.\nKarla Acha — Excelente profesional, ultra dedicado, cercano y accesible. Nos ha brindado apoyo incluso en situaciones graves, donde no ha dudado en estar disponible.\nMatías Hernández — Excelente servicio de psicoanálisis: entrega y ayuda a generar herramientas significativas para salir adelante en cualquier aspecto de la vida. Eficiente, claro y amigable.',
  },
  contact: {
    title: '¿Listo para empezar tu proceso?',
    body: 'Dirección: Lautaro 1775 C, oficina N°3, Barrancas, San Antonio, Chile\nTeléfono: +56 9 5407 2852\nHorario: Lunes a viernes desde las 14:00 · Sábado 8:00 a 14:00',
  },
}

// Query key compartida por Landing y PublicLayout (footer) para reusar cache.
export const PUBLIC_CONTENT_QUERY_KEY = ['public-content']

// Combina la respuesta real de la API con los fallbacks: por sectionKey,
// usa el bloque real si existe, si no cae al fallback local.
export function mergeContentBlocks(blocks) {
  const bySectionKey = new Map((blocks ?? []).map((b) => [b.sectionKey, b]))
  const merged = {}
  for (const sectionKey of Object.keys(FALLBACKS)) {
    merged[sectionKey] = bySectionKey.get(sectionKey) ?? {
      sectionKey,
      ...FALLBACKS[sectionKey],
    }
  }
  return merged
}
