const express = require("express");
const router = express.Router();

const templateController=require("../controllers/templateController");



router.post("/",templateController.postController);

router.get("/",templateController.getTemplatesController);

router.put("/:id",templateController.updateTemplateController);

router.delete("/:id",templateController.deleteTemplateController);

module.exports = router;