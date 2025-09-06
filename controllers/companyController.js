const { CompanySchema } = require('../utils/validations');
const { AppError } = require('../utils/AppError');
const {
  createCompany,
  getCompanies,
  findCompanyById,
  deleteCompany
} = require('../services/companyService');

const createCompanyController = async (req, res, next) => {
  try {
    const result = CompanySchema.safeParse(req.body);
    if (!result.success) {
      const firstMessage = result.error.errors[0]?.message || 'Error de validación';
      throw new AppError(firstMessage, 400, 'validation');
    }

    const validatedData = result.data;
    const newCompany = await createCompany(validatedData);

    res.status(201).json({
      message: "Empresa creada correctamente",
      company: newCompany
    });
  } catch (error) {
    console.log("Error createCompanyController:", error);
    next(error);
  }
};

const getCompaniesController = async (req, res, next) => {
  try {
    const companies = await getCompanies();
    res.status(200).json({
      companies,
      total: companies.length
    });
  } catch (error) {
    console.log("Error getCompaniesController:", error);
    next(error);
  }
};

const findCompanyByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await findCompanyById(id);

    if (!company) {
      throw new AppError("Empresa no encontrada", 404, "company");
    }

    res.status(200).json({ company });
  } catch (error) {
    console.log("Error findCompanyByIdController:", error);
    next(error);
  }
};

const deleteCompanyController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const company = await findCompanyById(id);

    if (!company) {
      throw new AppError("Empresa no encontrada", 404, "company");
    }

    await deleteCompany(id);
    res.status(200).json({
      message: "Empresa eliminada correctamente"
    });
  } catch (error) {
    console.log("Error deleteCompanyController:", error);
    next(error);
  }
};

module.exports = {
  createCompanyController,
  getCompaniesController,
  findCompanyByIdController,
  deleteCompanyController
};