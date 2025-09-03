
const { AppError } = require('../utils/AppError');


const { getTemplates,createTemplate, validarTemplatePersonalizado,updateTemplate,deleteTemplate,getTemplatesByRole,
    getTemplatesByAuthorId,getTemplateByID } = require("../services/templateServices");


const postController = async (req, res, next) => {
  try {
    const newTemplate = req.body;

    await validarTemplatePersonalizado(newTemplate);

    const creada = await createTemplate(newTemplate);
    const plantillaConAutor= await getTemplateByID(creada._id);
    res.status(201).json(plantillaConAutor); 
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
    //const userId = req.user?.id; 
    const camposActualizados = req.body;
    console.log("Campos a actualizar:",camposActualizados);

    /*if (!userId) {
      throw new AppError("Usuario no autenticado", 401, "auth");
    }*/
    
    const resultado = await updateTemplate(id, camposActualizados);
    res.status(200).json(resultado);
  } catch (error) {
    next(error); // Usa tu middleware de manejo de errores
  }
}

async function deleteTemplateController(req, res, next) {
  try {
    const { id } = req.params;
    const resultado = await deleteTemplate(id);
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
}



const getTemplatesByRoleController = async (req, res, next) => {
  try {
    const { role } = req.params;
    
    if (!role || typeof role !== "string") {
      throw new AppError("Rol inválido o no proporcionado", 400, "role");
    }
    if(!["admin","usuario","invitado"].includes(role)){
      throw new AppError("Rol no reconocido", 400, "role");
    }

    const templatesBD = await getTemplatesByRole(role);
    res.status(200).json(templatesBD);
  } catch (e) {
    console.log("Error getTemplatesByRoleController:", e);
    next(e);
  }
};

const getTemplatesByAuthorIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      throw new AppError("ID de autor inválido o no proporcionado", 400, "authorId");
    }
    const templatesBD = await getTemplatesByAuthorId(id);
    res.status(200).json(templatesBD);
  } catch (e) {
    console.log("Error getTemplatesByAuthorIdController:", e);
    next(e);
  }
};


module.exports = {
  postController,
  getTemplatesController,
  updateTemplateController,
  deleteTemplateController,
  getTemplatesByRoleController,
  getTemplatesByAuthorIdController
};


