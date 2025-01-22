const crypto = require("crypto");

const generateRandomId = () => {
  return crypto.randomInt(100000, 1000000);
};

module.exports = { generateRandomId };
