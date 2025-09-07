const express = require('express');
const router = express.Router();
const {
  createCompanyController,
  getCompaniesController,
  getCompaniesByAuthorController,
  findCompanyByIdController,
  deleteCompanyController
} = require('../controllers/companyController');

router.post('/', createCompanyController);

router.get('/', getCompaniesController);

router.get('/author/:id',getCompaniesByAuthorController);

router.get('/:id', findCompanyByIdController);

router.delete('/:id', deleteCompanyController);

module.exports = router;
