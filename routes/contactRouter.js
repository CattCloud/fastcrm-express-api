const express = require("express");
const router = express.Router();
const {
  createContactController,
  getContactsController,
  getContactsByAuthorController,
  deleteContactController
} = require("../controllers/contactController");


router.post("/", createContactController);

router.get("/", getContactsController);

router.get("/author/:id", getContactsByAuthorController);

router.delete("/:id", deleteContactController);

module.exports = router;