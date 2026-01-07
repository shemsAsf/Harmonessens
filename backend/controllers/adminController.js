const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { password } = req.body;
  console.log("I'm here!", password);

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
};

module.exports = {
	login
};
