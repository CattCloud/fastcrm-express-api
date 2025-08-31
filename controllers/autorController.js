const { AppError } = require('../utils/AppError');
const autorService = require("../services/authorsServices");
const bcrypt = require("bcrypt");

const postController = async (req, res, next) => {
    try {
        const newAutor = req.body;
        // Validación
        await autorService.validacionAuthor(newAutor);
        // Normaliza el usernameLower
        newAutor.usernameLower = newAutor.username.toLowerCase();
        // Encripta la contraseña
        const saltRounds = 10;
        newAutor.password = await bcrypt.hash(newAutor.password, saltRounds);
        // Crea el autor
        await autorService.createAuthor(newAutor);
        // Respuesta exitosa
        res.status(201).json({ message: "Autor creado correctamente"});
    } catch (e) {
        console.log("Error autorPostController:", e);
        next(e); // Pasa el error al middleware de manejo
    }
};

module.exports = {
    postController
};