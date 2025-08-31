const {templates} = require("../models/Template");
const { AppError } = require('../utils/AppError');
const { authors } = require("../models/Autor");
const { etiquetasSugeridas } = require("../utils/etiquetasSugeridas");
const unlistedTags  = require("../models/UnlistedTag");
const suggestedTags  = require("../models/SuggestedTag");

async function getTemplates(){
    try{
        const templatesBD = await templates.find();
        return templatesBD;
    }catch(e){
        console.log("Error getTemplates: ",e)
        throw e;   
    }
}

async function createTemplate(newTemplate) {
    try{
       await templates.create(newTemplate);
    }catch(e){
        console.log("Error createTemplate: ",e)
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



async function updateTemplate(id, updatedFields, userId) {
  try {
    const plantillaBD = await templates.findById(id);
    if (!plantillaBD) {
      throw new AppError("Plantilla no encontrada", 404, "id");
    }

    if (String(plantillaBD.author) !== String(userId)) {
      throw new AppError("No tienes permiso para editar esta plantilla", 403, "author");
    }

    // Solo permitir campos editables
    const camposPermitidos = ["type", "content", "labels"];

    const camposInvalidos = Object.keys(updatedFields).filter(c => !camposPermitidos.includes(c));
    if (camposInvalidos.length > 0) {
      throw new AppError(`Campos no permitidos: ${camposInvalidos.join(", ")}`, 400, "payload");
    }

    // Validar campos como si fuera nuevo
    const plantillaActualizada = {
      ...plantillaBD.toObject(),
      ...updatedFields,
      author: plantillaBD.author // proteger autor
    };

    await validarTemplatePersonalizado(plantillaActualizada);

    // Actualizar en BD
    await templates.updateOne({ _id: id }, { $set: updatedFields });

    return { mensaje: "Plantilla actualizada correctamente" };
  } catch (e) {
    console.log("Error updateTemplate: ", e);
    throw e;
  }
}


async function deleteTemplate(id, userId) {
  try {
    const plantillaBD = await templates.findById(id);
    if (!plantillaBD) {
      throw new AppError("Plantilla no encontrada", 404, "id");
    }

    
    if (String(plantillaBD.author) !== String(userId)) {
      throw new AppError("No tienes permiso para eliminar esta plantilla", 403, "author");
    }

    
    await templates.deleteOne({ _id: id });

    return { mensaje: "Plantilla eliminada correctamente" };
  } catch (error) {
    console.log("Error deleteTemplate:", error);
    throw error;
  }
}


module.exports={
    getTemplates,
    createTemplate,
    validarTemplatePersonalizado,
    updateTemplate,
    deleteTemplate
}

