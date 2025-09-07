const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { AppError } = require('../utils/AppError');
const { getTemplateByID } = require('../services/templateServices'); 

// Crear un nuevo ContactLog
async function createContactLog({ contactId, templateId }) {
    try {
        // Validar existencia del contacto
        const contactoBD = await prisma.contact.findUnique({
            where: { id: contactId }
        });

        if (!contactoBD) {
            throw new AppError("Contacto no encontrado", 404, "contactId");
        }

        // Validar existencia de plantilla si se envía
        if (templateId) {
            const plantillaBD = await getTemplateByID(templateId);
            if (!plantillaBD) {
                throw new AppError("Plantilla no encontrada", 404, "templateId");
            }
        }

        // Crear log
        const nuevoLog = await prisma.contactLog.create({
            data: {
                contactId,
                templateId
            }
        });

        return nuevoLog;
    } catch (error) {
        console.log("Error createContactLog:", error);
        throw error;
    }
}

// Obtener todos los ContactLogs
async function getAllContactLogs() {
    try {
        const logs = await prisma.contactLog.findMany({
            include: {
                contact: {
                    select: {
                        id: true,
                        name: true,
                        whatsapp: true,
                        authorId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return logs;
    } catch (error) {
        console.log("Error getAllContactLogs:", error);
        throw error;
    }
}

async function getContactLogsByAuthorId(authorId) {
    try {
        if (!authorId || typeof authorId !== 'string') {
            throw new AppError("ID de autor inválido", 400, "authorId");
        }

        // Validar existencia del contacto
        const contactoBD = await prisma.contact.findUnique({
            where: { id: contactId }
        });

        if (!contactoBD) {
            throw new AppError("Contacto no encontrado", 404, "contactId");
        }

        const logs = await prisma.contactLog.findMany({
            where: {
                contact: {
                    authorId: authorId
                }
            },
            include: {
                contact: {
                    select: {
                        id: true,
                        name: true,
                        whatsapp: true,
                        authorId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return logs;
    } catch (error) {
        console.log("Error getContactLogsByAuthorId:", error);
        throw error;
    }
}

module.exports = {
    createContactLog,
    getAllContactLogs,
    getContactLogsByAuthorId
};