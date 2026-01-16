const jwt = require("jsonwebtoken");

const login = (req, res) => {
  const { password } = req.body;s

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
};

const checkEnv = (req, res) => {
  return res.status(404).json({
    adPass : process.env.ADMIN_PASSWORD || "not found",
    email: process.env.EMAIL_USER || "not found",
    dbHost: process.env.DB_HOST || "not found",
    dbPass: process.env.DB_PASS || "not found",
    dbUser: process.env.DB_USER || "not found",

  })
}

module.exports = {
	login,
  checkEnv
};
