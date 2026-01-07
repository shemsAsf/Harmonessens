const controller = require("../controllers/emailController");
const express = require("express");
const router = express.Router();

router.post("/contact",controller.sendContactEMail);

module.exports = router;