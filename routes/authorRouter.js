const express = require("express");
const router = express.Router();

const authorController=require("../controllers/autorController");


router.post("/",authorController.postController);
router.post("/login",authorController.loginAuthorController)


router.get("/guest",authorController.getGuestAuthorController)
router.get("/:id",authorController.getAuthorByIDController)



module.exports = router;

