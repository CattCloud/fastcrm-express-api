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
    res.status(201).json({ message: "Autor creado correctamente" });
  } catch (e) {
    console.log("Error autorPostController:", e);
    next(e); // Pasa el error al middleware de manejo
  }
};


const getAuthorByIDController = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      throw new AppError("ID inválido o no proporcionado", 400, "author");
    }
    const autorBD = await autorService.getAuthorByID(id);
    res.status(200).json({ autor: autorBD });
  } catch (e) {
    console.log("Error getAuthorByIDController:", e);
    next(e);
  }
};

const getGuestAuthorController = async (req, res, next) => {
  try {
    const autorBD = await autorService.getGuestAuthor();
    res.status(200).json({ autor: autorBD });
  } catch (e) {
    console.log("Error getGuestAuthorController:", e);
    next(e);
  }
};

const loginAuthorController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new AppError("Username y password requeridos", 400, "login");
    }

    const autorBD = await autorService.loginAuthor({ username, password });
    res.status(200).json({ autor: autorBD });
  } catch (e) {
    console.log("Error loginAuthorController:", e);
    next(e);
  }
};


module.exports = {
  postController,
  getAuthorByIDController,
  getGuestAuthorController,
  loginAuthorController
};