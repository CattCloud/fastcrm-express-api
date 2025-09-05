const { templates } = require("../models/Template");
const { AppError } = require('../utils/AppError');
const { authors } = require("../models/Autor");
const { etiquetasSugeridas } = require("../utils/etiquetasSugeridas");
const unlistedTags = require("../models/UnlistedTag");
const suggestedTags = require("../models/SuggestedTag");
const { getAuthorByID } = require("./authorsServices")
const { TEMPLATE_TYPES } = require("../utils/constants");

async function getTemplates() {
  try {
    const templatesBD = await templates.find().populate({
      path: "author",
      select: "username role isActive accessCount createdAt updatedAt"
    });
    return templatesBD;
  } catch (e) {
    console.log("Error getTemplates: ", e)
    throw e;
  }
}

async function createTemplate(newTemplate) {
  try {
    return await templates.create(newTemplate);
  } catch (e) {
    console.log("Error createTemplate: ", e)
    throw e;
  }
}



async function validarTemplatePersonalizado(newTemplate) {
  const { type, content, labels, author } = newTemplate;

  // Validar existencia de autor
  const autorBD = await authors.findById(author);
  if (!autorBD || !autorBD.isActive) {
    throw new AppError("Autor inválido o inactivo", 400, "autor");
  }

  // Validar contenido no vacío
  if (!content || typeof content !== "string" || content.trim() === "") {
    throw new AppError("El contenido de la plantilla es obligatorio", 400, "content");
  }

  // Normalizar etiquetas
  const etiquetasNormalizadas = labels.map(tag => tag.toLowerCase().trim());
  const etiquetasUnicas = [...new Set(etiquetasNormalizadas)];

  if (etiquetasUnicas.length !== etiquetasNormalizadas.length) {
    throw new AppError("Las etiquetas no deben estar duplicadas", 400, "labels");
  }

  // Validar etiquetas bloqueadas
  const bloqueadas = await suggestedTags.find({ tag: { $in: etiquetasUnicas }, bloqueada: true });
  if (bloqueadas.length > 0) {
    throw new AppError(`Etiqueta bloqueada: ${bloqueadas.map(e => e.tag).join(", ")}`, 400, "labels");
  }

  // Registrar etiquetas no sugeridas
  for (const tag of etiquetasUnicas) {
    const existeSugerida = etiquetasSugeridas.includes(tag);
    if (!existeSugerida) {
      const existente = await unlistedTags.findOne({ normalizada: tag });
      if (existente) {
        await unlistedTags.updateOne({ _id: existente._id }, { $inc: { vecesDetectada: 1 } });
      } else {
        await unlistedTags.create({
          tag,
          normalizada: tag,
          fechaDeteccion: new Date(),
          vecesDetectada: 1,
          promovida: false
        });
      }
    }
  }

  // Reasignar etiquetas normalizadas
  newTemplate.labels = etiquetasUnicas;
}



async function updateTemplate(id, updatedFields) {
  try {
    const plantillaBD = await templates.findById(id);
    if (!plantillaBD) {
      throw new AppError("Plantilla no encontrada", 404, "id");
    }

    const camposPermitidos = ["type", "content", "labels"];
    const camposInvalidos = Object.keys(updatedFields).filter(c => !camposPermitidos.includes(c));
    if (camposInvalidos.length > 0) {
      throw new AppError(`Campos no permitidos: ${camposInvalidos.join(", ")}`, 400, "payload");
    }

    const plantillaActualizada = {
      ...plantillaBD.toObject(),
      ...updatedFields,
      author: plantillaBD.author
    };

    await validarTemplatePersonalizado(plantillaActualizada);
    await templates.updateOne({ _id: id }, { $set: updatedFields });


    const plantillaFinal = await getTemplateByID(id);

    return {
      mensaje: "Plantilla actualizada correctamente",
      template: plantillaFinal
    };
  } catch (e) {
    console.log("Error updateTemplate: ", e);
    throw e;
  }
}




async function deleteTemplate(id) {
  try {
    const plantillaBD = await templates.findById(id);
    if (!plantillaBD) {
      throw new AppError("Plantilla no encontrada", 404, "id");
    }
    await templates.deleteOne({ _id: id });

    return { mensaje: "Plantilla eliminada correctamente" };
  } catch (error) {
    console.log("Error deleteTemplate:", error);
    throw error;
  }
}

async function getTemplateByID(idTemplate) {
  try {
    const plantillaConAutor = await templates.findById(idTemplate).populate({
      path: "author",
      select: "username role isActive accessCount createdAt updatedAt"
    });
    if (!plantillaConAutor) {
      throw new AppError("Plantilla no encontrada", 404, "id");
    }
    return plantillaConAutor;
  } catch (e) {
    console.log("Error getTemplateByID:", e);
  }
}

async function getTemplatesByRole(role) {
  try {
    const templatesBD = await templates
      .find()
      .populate({
        path: "author",
        select: "username role isActive accessCount createdAt updatedAt",
        match: { role, isActive: true }
      });

    // Filtrar solo las plantillas que sí tienen autor con ese rol
    const filtradas = templatesBD.filter(t => t.author); // populate devuelve null si no coincide

    return filtradas;
  } catch (e) {
    console.log("Error getTemplatesByRole:", e);
    throw e;
  }
}

async function getTemplatesByAuthorId(authorId) {
  try {
    await getAuthorByID(authorId); //Verifica que el autor exista
    const templatesBD = await templates
      .find({ author: authorId })
      .populate({
        path: "author",
        select: "username role isActive accessCount createdAt updatedAt"
      });
    return templatesBD;
  } catch (e) {
    console.log("Error getTemplatesByAuthorId:", e);
    throw e;
  }
}

function validateType(type) {
  if (!type) return;
  const normalizedType = type.trim().toLowerCase();
  const allowedTypes = TEMPLATE_TYPES.map(t => t.toLowerCase());
  if (!allowedTypes.includes(normalizedType)) {
    throw new AppError("Tipo de plantilla inválido", 400, "type");
  }
  return normalizedType;
}

async function searchTemplatesByKeywordAndRole(keyword, role, type) {
  try {
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 2) {
      throw new AppError("Palabra clave inválida", 400, "query");
    }

    validateType(type); // validación defensiva

    const regex = new RegExp(keyword.trim(), 'i');

    const query = {
      content: { $regex: regex },
      ...(type && { type })
    };

    const rawTemplates = await templates.find(query).populate({
      path: "author",
      select: "username role isActive accessCount createdAt updatedAt"
    });

    const filteredTemplates = rawTemplates.filter(t => {
      return t.author && t.author.role === role && t.author.isActive;
    });

    return filteredTemplates;
  } catch (e) {
    console.log("Error searchTemplatesByKeywordAndRole:", e);
    throw e;
  }
}

async function searchTemplatesByKeywordAndAuthorId(keyword, authorId, type) {
  try {
    if (!keyword || typeof keyword !== 'string' || keyword.trim().length < 2) {
      throw new AppError("Palabra clave inválida", 400, "query");
    }

    if (!authorId || typeof authorId !== 'string') {
      throw new AppError("ID de autor inválido", 400, "author");
    }

    validateType(type);

    const regex = new RegExp(keyword.trim(), 'i');

    const query = {
      content: { $regex: regex },
      author: authorId,
      ...(type && { type })
    };

    const templatesBD = await templates.find(query).populate({
      path: "author",
      select: "username role isActive accessCount createdAt updatedAt"
    });

    return templatesBD;
  } catch (e) {
    console.log("Error searchTemplatesByKeywordAndAuthorId:", e);
    throw e;
  }
}

async function searchTemplatesByKeyword(q, type) {
  try {
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      throw new AppError("Palabra clave inválida", 400, "query");
    }

    validateType(type);

    const regex = new RegExp(q.trim(), 'i');

    const query = {
      content: { $regex: regex },
      ...(type && { type })
    };

    return await templates.find(query).populate({
      path: "author",
      select: "username role isActive accessCount createdAt updatedAt"
    });

  } catch (e) {
    console.log("Error searchTemplatesByKeyword:", e);
    throw e;
  }
}

module.exports = {
  getTemplates,
  createTemplate,
  validarTemplatePersonalizado,
  updateTemplate,
  deleteTemplate,
  getTemplatesByRole,
  getTemplatesByAuthorId,
  getTemplateByID,
  searchTemplatesByKeyword,
  searchTemplatesByKeywordAndRole,
  searchTemplatesByKeywordAndAuthorId
}

