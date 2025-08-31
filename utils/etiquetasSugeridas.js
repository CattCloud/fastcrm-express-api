const  suggestedTags = require("../models/SuggestedTag");

let etiquetasSugeridas = [];

async function cargarEtiquetasSugeridas() {
    try {
        const sugeridasBD = await suggestedTags.find({ visible: true, bloqueada: false });
        etiquetasSugeridas = sugeridasBD.map(e => e.tag);
    } catch (e) {
        console.log("Error en cargarEtiquetasSugeridas", e);
        throw e;
    }
}

function getEtiquetasSugeridas() {
    return etiquetasSugeridas;
}

module.exports = { cargarEtiquetasSugeridas, etiquetasSugeridas };
