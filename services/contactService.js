const { prisma } = require('../config/prisma');
const { AppError } = require('../utils/AppError');
const autorService = require("../services/authorsServices");


const createContact = async (data) => {
    try {
        return await prisma.contact.create({ data });
    } catch (e) {
        console.log("Error createContact: ", e);
        throw e;
    }
};

const validateDuplicateContact = async (authorId, name, whatsapp) => {
    // Validar duplicado por WhatsApp dentro del mismo autor
    const existingByWhatsapp = await prisma.contact.findFirst({
        where: {
            authorId,
            whatsapp
        }
    });
    if (existingByWhatsapp) {
        throw new AppError("Ya tiene un contacto registrado con este número de WhatsApp", 400, "validation");
    }

    // Validar duplicado por nombre dentro del mismo autor
    const existingByName = await prisma.contact.findFirst({
        where: {
            authorId,
            name
        }
    });
    if (existingByName) {
        throw new AppError("Ya existe un contacto con ese nombre", 400, "validation");
    }
};

const getContacts = async ({ orderBy = 'createdAt', order = 'desc' }) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { [orderBy]: order }
        });

        const enrichedContacts = await Promise.all(
            contacts.map(async (contact) => {
                let authorName = 'Autor desconocido';
                try {
                    const author = await autorService.getAuthorByID(contact.authorId);
                    if (author.username) authorName = author.username;
                } catch (e) {
                    console.log(`No se pudo obtener el autor ${contact.authorId}:`, e.message);
                }
                return {
                    ...contact,
                    authorName
                };
            })
        );

        return enrichedContacts;
    } catch (e) {
        console.log("Error getContacts:", e);
        throw e;
    }
};



const getContactsByAuthorID = async (authorId) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: { authorId }
    });

    // Obtener el nombre del autor desde MongoDB
    let authorName = 'Autor desconocido';
    try {
      const author = await autorService.getAuthorByID(authorId);
      console.log("Author fetched:", author.username);
      if (author.username) authorName = author.username;
    } catch (e) {
      console.log(`No se pudo obtener el autor ${authorId}:`, e.message);
    }

    // Enriquecer cada contacto con el nombre del autor
    const enrichedContacts = contacts.map((contact) => ({
      ...contact,
      authorName
    }));

    return enrichedContacts;
  } catch (e) {
    console.log("Error getContactsByAuthorID:", e);
    throw e;
  }
};



const findContactById = async (id) => {
    try {
        return await prisma.contact.findUnique({
            where: { id: Number(id) }
        });
    } catch (e) {
        console.log("Error findContactById:", e);
        throw e;
    }

};

const deleteContact = async (id) => {
    try {
        return await prisma.contact.delete({
            where: { id: Number(id) }
        });
    } catch (e) {
        console.log("Error deleteContact:", e);
        throw e;
    }

};

module.exports = {
    createContact,
    getContacts,
    findContactById,
    deleteContact,
    validateDuplicateContact,
    getContactsByAuthorID
};