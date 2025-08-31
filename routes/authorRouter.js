const express = require("express");
const router = express.Router();

const authorController=require("../controllers/autorController");

router.post("/",authorController.postController);



module.exports = router;