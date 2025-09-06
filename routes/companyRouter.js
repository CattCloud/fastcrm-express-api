const express = require('express');
const router = express.Router();
const {
  createCompanyController,
  getCompaniesController,
  findCompanyByIdController,
  deleteCompanyController
} = require('../controllers/companyController');

router.post('/', createCompanyController);

router.get('/', getCompaniesController);

router.get('/:id', findCompanyByIdController);

router.delete('/:id', deleteCompanyController);

module.exports = router;
