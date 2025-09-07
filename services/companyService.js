const { prisma } = require('../config/prisma');
const { AppError } = require('../utils/AppError');

const createCompany = async (data) => {
  try {
    
    const existing = await prisma.company.findUnique({
      where: { ruc: data.ruc }
    });
    if (existing) {
      throw new AppError("Ya existe una empresa con ese RUC", 400, "validation");
    }
    return await prisma.company.create({ data });
  } catch (e) {
    console.log("Error createCompany:", e);
    throw e;
  }
};

const getCompanies = async () => {
  try {
    return await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        contacts: {
          select: {
            id: true,
            name: true,
            whatsapp: true,
            authorId: true
          }
        }
      }
    });
  } catch (e) {
    console.log("Error getCompanies:", e);
    throw e;
  }
};

const findCompanyById = async (id) => {
  try {
    return await prisma.company.findUnique({
      where: { id: Number(id) },
      include: {
        contacts: true
      }
    });
  } catch (e) {
    console.log("Error findCompanyById:", e);
    throw e;
  }
};

const getCompaniesByAuthor = async (authorId) => {
  try {
    if (!authorId) {
      throw new AppError("Falta el authorId para filtrar empresas", 400, "validation");
    }
    
    return await prisma.company.findMany({
      where: {
        contacts: {
          some: {
            authorId: authorId // ← solo empresas donde el usuario tiene al menos un contacto
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        contacts: {
          where: {
            authorId: authorId // ← solo los contactos del usuario dentro de cada empresa
          },
          select: {
            id: true,
            name: true,
            whatsapp: true,
            authorId: true
          }
        }
      }
    });
  } catch (e) {
    console.log("Error getCompaniesByAuthor:", e);
    throw e;
  }
};

const deleteCompany = async (id) => {
  try {
    return await prisma.company.delete({
      where: { id: Number(id) }
    });
  } catch (e) {
    console.log("Error deleteCompany:", e);
    throw e;
  }
};

module.exports = {
  createCompany,
  getCompanies,
  findCompanyById,
  deleteCompany,
  getCompaniesByAuthor
};