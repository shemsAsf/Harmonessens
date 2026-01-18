const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminController.js");

router.post("/login", controller.login); 

/* THIS IS TEST ONLY, REMOVE BEFORE PROD !!! */
// router.get("/checkEnv", controller.checkEnv); 

module.exports = router;
