const sqlite3 = require("better-sqlite3");
const path = require("path");

// Define database 
let db;
try {
  //Path for local dev db
  const dbPath = path.join(__dirname, "../data/harmonessensDB.sqlite");
  db = new sqlite3(dbPath);
}
catch {
  //Path for Render db
  const dbPath = path.join("/data", "harmonessensDB.sqlite");
  db = new sqlite3(dbPath);
}

// Function to create tables if they don’t exist
const checkAndCreateTables = () => {
  const createClientsTableQuery = `
    DROP TABLE IF EXISTS clients;
  `;

  const createAppointmentsTableQuery = `
    DROP TABLE IF EXISTS appointments;
  `;

  const createServicesTableQuery = `
    DROP TABLE IF EXISTS services;
  `;

  try {
    db.exec(createClientsTableQuery);
    db.exec(createAppointmentsTableQuery);
    db.exec(createServicesTableQuery);
    console.log("SQLite tables checked/created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};

module.exports = { db, checkAndCreateTables };
