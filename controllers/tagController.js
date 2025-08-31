const {
  createSuggestedTag,
  createUnlistedTag
} = require("../services/tagsServices");

const createSuggestedTagController = async (req, res, next) => {
  try {
    const { tag, bloqueada = false } = req.body;

    if (!tag || typeof tag !== "string") {
      throw new AppError("El tag es obligatorio y debe ser texto", 400, "tag");
    }

    await createSuggestedTag({ tag: tag.trim().toLowerCase(), bloqueada });
    res.status(201).json({ message: "Etiqueta sugerida creada" });

  } catch (e) {
    console.log("Error createSuggestedTagController:", e);
    next(e);
  }
};

const createUnlistedTagController = async (req, res, next) => {
  try {
    const { tag } = req.body;

    if (!tag || typeof tag !== "string") {
      throw new AppError("El tag es obligatorio y debe ser texto", 400, "tag");
    }

    const normalizada = tag.trim().toLowerCase();
    await createUnlistedTag({
      tag,
      normalizada,
      fechaDeteccion: new Date(),
      vecesDetectada: 1,
      promovida: false
    });

    res.status(201).json({ message: "Etiqueta no listada registrada" });

  } catch (e) {
    console.log("Error createUnlistedTagController:", e);
    next(e);
  }
};

module.exports = {
  createSuggestedTagController,
  createUnlistedTagController
};