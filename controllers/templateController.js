const { getTemplates,createTemplate, validarTemplatePersonalizado,updateTemplate,deleteTemplate  } = require("../services/templateServices");

const postController = async (req, res, next) => {
  try {
    const newTemplate = req.body;

    // Validación personalizada (autor, etiquetas, contenido)
    await validarTemplatePersonalizado(newTemplate);

    await createTemplate(newTemplate);

    // Respuesta exitosa
    res.status(201).json({ message: "Plantilla creada correctamente" });

  } catch (e) {
    console.log("Error postController:", e);
    next(e); 
  }
};
const getTemplatesController = async (req, res, next) => {
  try {
    const templates = await getTemplates();
    res.status(200).json(templates);
  } catch (e) {
    console.log("Error getTemplatesController:", e);
    next(e);
  }
};



async function updateTemplateController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Auth middleware que inyecta el usuario
    const camposActualizados = req.body;
    console.log("Campos a actualizar:",camposActualizados);
    if (!userId) {
      throw new AppError("Usuario no autenticado", 401, "auth");
    }

    const resultado = await updateTemplate(id, camposActualizados, userId);
    res.status(200).json(resultado);
  } catch (error) {
    next(error); // Usa tu middleware de manejo de errores
  }
}

async function deleteTemplateController(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Usuario no autenticado", 401, "auth");
    }
    
    const resultado = await deleteTemplate(id, userId);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}



module.exports = {
  postController,
  getTemplatesController,
  updateTemplateController,
  deleteTemplateController
};


