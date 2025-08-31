const express = require("express");
const router = express.Router();
const {
  createSuggestedTagController,
  createUnlistedTagController
} = require("../controllers/tagController.js");


router.post("/suggested", createSuggestedTagController);
router.post("/unlisted", createUnlistedTagController);


module.exports = router;