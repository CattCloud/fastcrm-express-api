const express = require('express');
const router = express.Router();
const {
    createContactLogController,
    getAllContactLogsController,
    getContactLogsByAuthorIdController
} = require('../controllers/contactoLogController');

router.post('/', createContactLogController);

router.get('/', getAllContactLogsController);

router.get('/author/:id', getContactLogsByAuthorIdController);

module.exports = router;
