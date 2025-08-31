const {authors} = require("../models/Autor");
const { AppError } = require('../utils/AppError');

async function getAuthors(){
    try{
        const authorsBD = await authors.find();
        return authorsBD;
    }catch(e){
        console.log("Error getAuthors: ",e)
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
  getAuthors
}

