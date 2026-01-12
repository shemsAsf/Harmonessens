module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.test.js"],
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
