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

router.get("/search", templateController.searchTemplatesIDController); 
router.get("/search/role", templateController.searchTemplatesRolController); 
router.get("/search/admin", templateController.searchTemplatesController); 


router.put("/:id",templateController.updateTemplateController);

router.delete("/:id",templateController.deleteTemplateController);




module.exports = router;