const {
  createContactLog,
  getAllContactLogs,
  getContactLogsByAuthorId
} = require('../services/contactLogService');

const { AppError } = require('../utils/AppError');
const { getTemplateByID } = require('../services/templateServices'); 


const createContactLogController = async (req, res, next) => {
  try {
    const { contactId, templateId } = req.body;

    if (!contactId || typeof contactId !== 'number') {
      throw new AppError("ID de contacto inválido", 400, "contactId");
    }

    // Crear log
    const nuevoLog = await createContactLog({ contactId, templateId });

    
    let templateData = null;
    if (templateId) {
      const plantillaBD = await getTemplateByID(templateId);
      if (!plantillaBD) {
        throw new AppError("Plantilla no encontrada", 404, "templateId");
      }

      templateData = {
        id: plantillaBD._id,
        type: plantillaBD.type,
        content: plantillaBD.content,
        labels: plantillaBD.labels,
        createdAt: plantillaBD.createdAt,
        updatedAt: plantillaBD.updatedAt
      };
    }

    res.status(201).json({
      mensaje: "Log de contacto creado correctamente",
      log: {
        ...nuevoLog,
        template: templateData
      }
    });

  } catch (error) {
    console.log("Controller Error: createContactLogController", error);
    next(error);
  }
};

async function enrichContactLog(log) {
  let enrichedTemplate = null;

  if (log.templateId) {
    const plantilla = await getTemplateByID(log.templateId);
    if (plantilla) {
      enrichedTemplate = {
        id: plantilla._id,
        type: plantilla.type,
        content: plantilla.content,
        labels: plantilla.labels,
        createdAt: plantilla.createdAt,
        updatedAt: plantilla.updatedAt
      };
    }
  }

  return {
    ...log,
    template: enrichedTemplate
  };
}


const getAllContactLogsController = async (req, res, next) => {
  try {
    const logs = await getAllContactLogs();
    const enrichedLogs = await Promise.all(logs.map(enrichContactLog));
    res.status(200).json(enrichedLogs);
  } catch (error) {
    console.log("Controller Error: handleGetAllContactLogs", error);
    next(error);
  }
};

const getContactLogsByAuthorIdController = async (req, res, next) => {
  try {
    const { authorId } = req.params;

    const logs = await getContactLogsByAuthorId(authorId);
    const enrichedLogs = await Promise.all(logs.map(enrichContactLog));
    res.status(200).json(enrichedLogs);
  } catch (error) {
    console.log("Controller Error: handleGetContactLogsByAuthorId", error);
    next(error);
  }
};


module.exports = {
  createContactLogController,
  getAllContactLogsController,
  getContactLogsByAuthorIdController
};