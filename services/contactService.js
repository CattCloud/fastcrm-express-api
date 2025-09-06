const { prisma } = require('../config/prisma');
const { AppError } = require('../utils/AppError');
const autorService = require("../services/authorsServices");


const createContact = async (data) => {
    try {
        if (data.companyId) {
            const company = await prisma.company.findUnique({
                where: { id: Number(data.companyId) }
            });
            if (!company) {
                throw new AppError("La empresa no existe", 404, "validation");
            }
            data.company = { connect: { id: Number(data.companyId) } };
            delete data.companyId;
        }
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
                let companyName = null;

                // Enriquecer con nombre del autor
                try {
                    const author = await autorService.getAuthorByID(contact.authorId);
                    if (author.username) authorName = author.username;
                } catch (e) {
                    console.log(`No se pudo obtener el autor ${contact.authorId}:`, e.message);
                }

                // Enriquecer con nombre de la empresa
                if (contact.companyId) {
                    try {
                        const company = await prisma.company.findUnique({
                            where: { id: contact.companyId },
                            select: { name: true }
                        });
                        if (company?.name) companyName = company.name;
                    } catch (e) {
                        console.log(`No se pudo obtener la empresa ${contact.companyId}:`, e.message);
                    }
                }

                return {
                    ...contact,
                    authorName,
                    companyName
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

        const enrichedContacts = await Promise.all(
            contacts.map(async (contact) => {
                let companyName = null;
                if (contact.companyId) {
                    try {
                        const company = await prisma.company.findUnique({
                            where: { id: contact.companyId },
                            select: { name: true }
                        });
                        if (company?.name) companyName = company.name;
                    } catch (e) {
                        console.log(`No se pudo obtener la empresa ${contact.companyId}:`, e.message);
                    }
                }

                return {
                    ...contact,
                    authorName,
                    companyName
                };
            })
        );


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