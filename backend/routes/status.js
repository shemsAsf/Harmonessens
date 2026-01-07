const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("ping");
  res.status(200).json({ message: "API is running!" });
});

module.exports = router;
