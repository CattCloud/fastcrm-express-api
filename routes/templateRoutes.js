const express = require("express");
const router = express.Router();

const templateController=require("../controllers/templateController");



router.post("/",templateController.postController);

//Todos los templates
router.get("/",templateController.getTemplatesController);

//Template por rol(admin,usuario,invitado)
router.get("/rol/:role",templateController.getTemplatesByRoleController);

//Template por autor
router.get("/author/:id",templateController.getTemplatesByAuthorIdController);

router.put("/:id",templateController.updateTemplateController);

router.delete("/:id",templateController.deleteTemplateController);




module.exports = router;