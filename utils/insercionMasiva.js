const { templates } = require('../models/Template');

const TYPES = [
  "saludo", "recordatorio", "seguimiento", "despedida",
  "felicitación", "agradecimiento", "promoción", "urgente",
  "confirmación", "reprogramación"
];

const LABELS = [
  // Ciclo de interacción
  "bienvenida", "despedida", "recordatorio", "seguimiento", "confirmación",

  // Emocionales y sociales
  "felicitación", "agradecimiento", "motivación", "reconocimiento", "rechazo",

  // Técnicos y funcionales
  "desarrollo de software", "autenticación", "sistema", "error", "actualización",
  "pull request", "merge", "rollback", "hotfix", "deploy", "testing", "QA",

  // Editoriales y pedagógicos
  "instrucción", "evaluación", "retroalimentación", "tutorial", "ficha visual",
  "documentación", "onboarding técnico", "revisión de código",

  // Organizacionales
  "proyecto", "evento", "invitación", "reprogramación", "urgente",
  "planificación", "reunión", "deadline", "entrega", "prioridad",

  // Roles y flujo
  "frontend", "backend", "fullstack", "diseño", "producto", "scrum", "devops"
];


const AUTHOR_ID = "68b32dccd8f3dc2924b21840";

async function insertarPlantillasMasivas(cantidad = 300) {
  const bulk = [];

  for (let i = 0; i < cantidad; i++) {
    const tipo = TYPES[i % TYPES.length];
    const etiquetas = [
      LABELS[i % LABELS.length],
      LABELS[(i + 3) % LABELS.length]
    ];

    const plantilla = {
      type: tipo,
      content: `Plantilla #${i}: Este mensaje trata sobre "${tipo}" y aborda aspectos como ${etiquetas.join(" y ")} dentro del flujo editorial del equipo.`,
      labels: etiquetas,
      author: AUTHOR_ID
    };

    bulk.push(plantilla);
  }

  try {
    await templates.insertMany(bulk);
    console.log(`✅ Se insertaron ${bulk.length} plantillas correctamente.`);
  } catch (e) {
    console.error("❌ Error en inserción masiva:", e);
  }
}

module.exports= insertarPlantillasMasivas;
