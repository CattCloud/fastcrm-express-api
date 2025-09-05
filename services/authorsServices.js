const {authors} = require("../models/Autor");
const { AppError } = require('../utils/AppError');
const bcrypt = require("bcrypt");


async function getAuthors(){
    try{
        const authorsBD = await authors.find();
        return authorsBD;
    }catch(e){
        console.log("Error getAuthors: ",e)
        throw e;   
    }
}

async function getGuestAuthor() {
  try {
    const guest = await authors.findOne({ role: "invitado" });
    if (!guest) {
      throw new AppError("Usuario invitado no encontrado", 404);
    }
    return guest;
  } catch (e) {
    console.log("Error getGuestAuthor:", e);
    throw e;
  }
}

async function getAuthorByID(id) {
  try {
    const autorBD = await authors.findById(id);
    if (!autorBD) {
      throw new AppError("Autor no encontrado", 400);
    }
    return autorBD;
  } catch (e) {
    console.log("Error getAuthorByID:", e);
    throw e;
  }
}

async function createAuthor(newAutor) {
    try{
        await authors.create(newAutor);
    }catch(e){
        console.log("Error createAutor: ",e)
        throw e;
    }
}

async function loginAuthor({ username, password }) {
  try {
    const usernameLower = username.toLowerCase();
    const autorBD = await authors.findOne({ usernameLower });

    if (!autorBD) {
      throw new AppError("Usuario no encontrado", 404,"username");
    }

    const passwordValida = await bcrypt.compare(password, autorBD.password);
    if (!passwordValida) {
      throw new AppError("Contraseña incorrecta", 401,"password");
    }

    return autorBD;
  } catch (e) {
    console.log("Error loginAuthor:", e);
    throw e;
  }
}


async function validacionAuthor(newAutor) {
    try {
        // Normaliza el username para comparación insensible a mayúsculas
        const usernameLower = newAutor.username.toLowerCase();

        // Busca si ya existe un autor con ese usernameLower
        const autorExistente = await authors.findOne({ usernameLower:usernameLower });

        if (autorExistente) {
            throw new AppError("El nombre de usuario ya está en uso", 400);
        }
        return true;
    } catch (e) {
        console.log("Error en validacionAuthor:", e);
        throw e;
    }
}




module.exports={
  createAuthor,
  validacionAuthor,
  getAuthors,
  getAuthorByID,
  getGuestAuthor,
  loginAuthor
}

