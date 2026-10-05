export const site = {
  name: "Sarah Santana",
  firstName: "Sarah",
  lastName: "Santana",
  role: "Diseñadora UX/UI",
  cta: "Conoce mi mundo",
}

export const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#trabajo", label: "Trabajo" },
  { href: "#sobre", label: "Sobre mí" },
  { href: "#contacto", label: "Contacto" },
] as const

export const contact = {
  title: "Contacto",
  whatsapp: "https://wa.me/573001846300",
  columns: [
    [
      { label: "Teléfono", value: "+57 300 184 6300", href: "tel:+573001846300" },
      { label: "Nacionalidad", value: "Colombiana" },
    ],
    [
      {
        label: "Instagram",
        value: "@__santanaaaaaaaa",
        href: "https://www.instagram.com/__santanaaaaaaaa/",
      },
      {
        label: "Email",
        value: "sarah.santanac02@gmail.com",
        href: "mailto:sarah.santanac02@gmail.com",
      },
    ],
    [
      {
        label: "Linkedin",
        value: "@sarahsantanaco",
        href: "https://www.linkedin.com/in/sarahsantanaco",
      },
      {
        label: "Github",
        value: "sarahsantanac02-ai",
        href: "https://github.com/sarahsantanac02-ai",
      },
    ],
  ],
} as const

export const projects = [
  {
    slug: "emihs",
    label: "EMIHS",
    color: "#e38b7a",
    identity: {
      principle: "Tu mente primero",
      palette: [
        { name: "Morado", value: "#706199" },
        { name: "Menta", value: "#7df5d3" },
        { name: "Amarillo", value: "#ffd548" },
        { name: "Azul noche", value: "#313244" },
      ],
    },
    type: "Sistema educativo · en curso",
    role: "Estrategia de marca, research e identidad visual · cofundadora",
    year: "En curso",
    scope: "Marca, narrativa, personaje y landing",
    tagline: "Los niños ya le piden respuestas a la IA. Emihs les enseña a seguir haciendo las preguntas.",
    intro: "Un sistema educativo para niños de 4 a 12 años, profesores, colegios y familias. Su principio es simple: tu mente primero.",
    insights: [["4", "actores con producto propio"], ["1 día", "para llevar la landing a producción"], ["5–6", "entrevistas con docentes en curso"]],
    sections: [
      ["El problema", "El riesgo no es que un niño use IA. Es que llegue a un punto en que ya no quiera pensar sin ella. Emihs propone una IA mediada: primero se piensa; después se decide cómo la tecnología puede ayudar."],
      ["Un sistema, no una sola pantalla", "La propuesta contempla cuatro relaciones: Emihs for Children, for Teachers, for School y for Family. Los perfiles se presentan como hipótesis de trabajo hasta completar la validación de campo."],
      ["Una decisión de diseño que ordena todo", "¿Esto ayuda a construir criterio o solo está mostrando tecnología? funciona como pregunta filtro para marca, contenido y producto. Finn ya aparecía en Parche Inversionista, antecedente de EMIHS; aquí acompaña la historia, pero no la protagoniza."],
    ],
    note: "Emihs está vivo: la literatura sobre IA mediada sustenta la dirección; las entrevistas de campo con docentes siguen en curso.",
  },
  {
    slug: "antidoto-social",
    label: "ANTÍDOTO SOCIAL",
    color: "#9eb4c9",
    type: "UX/UI · marketplace de dos lados",
    role: "UX/UI end-to-end · proyecto individual",
    year: "2026",
    scope: "Web y móvil · viajero y negocio aliado",
    tagline: "El problema no es que falten planes en Bogotá. Es que organizarlos cuesta demasiado.",
    intro: "Antídoto convierte el ¿qué hacemos? en un plan decidido, reservado y con logística resuelta para grupos y negocios.",
    insights: [["40+", "personas entrevistadas en Bogotá"], ["2", "lados de la experiencia"], ["1", "plan compartido por el grupo"]],
    sections: [
      ["La oportunidad", "La oferta de Bogotá no era el problema. La fricción estaba entre la idea y el plan: información dispersa, logística oculta, costos tardíos y grupos intentando decidir por chat."],
      ["Una experiencia para dos lados", "Para las personas, el sistema filtra por presupuesto y tipo de grupo, muestra logística desde el inicio y habilita consenso con un link compartido. Para el negocio aliado, abre una herramienta para visibilidad, reservas y métricas."],
      ["Aprendizaje clave", "Mostrar parqueadero, reglas y condiciones desde el principio evita el abandono tardío: la fricción que más duele cuando el grupo ya estaba listo para salir."],
    ],
  },
  {
    slug: "drop",
    label: "DROP",
    color: "#e8c75a",
    type: "UX/UI · comunidad y música",
    role: "Líder de research, UI y testing · equipo de 3",
    year: "Caso UX/UI",
    scope: "Aplicación móvil · fans y artistas",
    tagline: "Apoyar a un artista debería sentirse como ser parte de algo, no como una compra más.",
    intro: "Una plataforma para conectar fans y artistas colombianos emergentes mediante compra oficial, contenido y comunidad.",
    insights: [["2", "rondas de testing"], ["SUS", "de Bueno a Excelente"], ["1", "ecosistema para descubrir, seguir y apoyar"]],
    sections: [
      ["El reto", "Las tiendas oficiales obligan a buscar artista por artista. Drop reúne compra, contenido y comunidad para que descubrir también sea parte de la experiencia."],
      ["Decisiones de producto", "El inicio prioriza a los artistas seguidos, luego abre espacio para nuevos talentos y noticias. La búsqueda usa filtros por categoría y género para que la exploración no saque al fan de la app."],
      ["Diseñar también es descartar", "El análisis heurístico previo al testing y la decisión de no forzar XR permitieron concentrar el esfuerzo en la experiencia que sí resolvía el comportamiento del usuario."],
    ],
  },
  {
    slug: "cardenalia",
    label: "CARDENALIA",
    color: "#a9b892",
    type: "Experiencia física",
    role: "Diseño de espacio, experiencia inmersiva e identidad visual · equipo de 3",
    year: "Proyecto de experiencia",
    scope: "Casa de la Cultura Vallenata · Valledupar",
    tagline: "Una experiencia inmersiva para volver a escuchar el origen, presente y futuro del vallenato.",
    intro: "Una experiencia atemporal que da visibilidad al origen del vallenato a través de espacio, capas narrativas e interacción.",
    insights: [["3", "capas de experiencia"], ["1", "personaje narrador"], ["OLED", "exploración interactiva"]],
    sections: [
      ["Diseñar un recorrido, no una exposición", "La experiencia combina un espacio físico, una pantalla táctil OLED para explorar historias al propio ritmo y paneles que construyen capítulos en el recorrido."],
      ["Una voz para la experiencia", "Un personaje animado narra historias, mitos y leyendas de Valledupar: una capa que conecta lo mítico con lo real y evita que la visita dependa solo de paneles informativos."],
      ["Lo que permanece", "El cierre propone una app complementaria para que el aprendizaje no termine al salir del espacio físico."],
    ],
  },
  {
    slug: "hackathons",
    label: "HACKATHONS",
    color: "#b7a6c9",
    type: "Laboratorio · retos de diseño",
    role: "UX de recorridos conversacionales y diseño de información · equipos de hackathon",
    year: "Dos retos documentados",
    scope: "Colsubsidio × 30X · Centinela (CTW)",
    tagline: "Diseñar recorridos completos bajo presión real de tiempo.",
    intro: "Esta carpeta reúne dos retos documentados en el portafolio anterior de Sarah. Son propuestas de hackathon, no resultados de productos desplegados.",
    insights: [["2", "retos documentados"], ["2", "canales explorados en Colsubsidio"], ["1", "circuito de ayuda propuesto en Centinela"]],
    sections: [
      ["Colsubsidio × 30X", "Sarah diseñó el recorrido de un agente conversacional para orientar a afiliados en la elección de seguros. El prototipo exploró WhatsApp y web, con énfasis en explicar por qué se recomendaba una opción."],
      ["Centinela (CTW)", "El reto propuso alertas sísmicas por WhatsApp y un circuito de información para coordinar ayuda después de un sismo. La propuesta distingue la intensidad local de la magnitud del epicentro y evita presentar datos de emergencia ficticios como reales."],
      ["Estado del archivo", "Ambos retos cuentan con documentación previa. Sus demos y prototipos no se presentan aquí como servicios operativos ni como métricas de impacto verificadas."],
    ],
  },
] as const

export type Project = (typeof projects)[number]

export const dockTools = [
  { id: "figma", name: "Figma" },
  { id: "illustrator", name: "Adobe Illustrator" },
  { id: "premiere", name: "Adobe Premiere Pro" },
  { id: "claude", name: "Claude" },
  { id: "lovable", name: "Lovable" },
  { id: "canva", name: "Canva" },
  { id: "maze", name: "Maze" },
] as const
