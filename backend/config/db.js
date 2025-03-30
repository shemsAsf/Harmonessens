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
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT DEFAULT NULL
    );
  `;

  const createAppointmentsTableQuery = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointmentId INTEGER NOT NULL,
      start_time TEXT NOT NULL,  -- Stored as ISO 8601 string (e.g., '2025-02-24T14:00:00Z')
      end_time TEXT NOT NULL,
      comment TEXT DEFAULT NULL,
      has_paid INTEGER DEFAULT 0,
      online INTEGER DEFAULT 0, -- 0 for in-person, 1 for online
      client_id INTEGER NOT NULL,
      FOREIGN KEY (appointmentId) REFERENCES services(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `;

  const createServicesTableQuery = `
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image TEXT,
      description TEXT NOT NULL,
      length INTEGER NOT NULL,
      price INTEGER NOT NULL,
      allowOnline INTEGER NOT NULL DEFAULT 0,
      isActive INTEGER NOT NULL DEFAULT 1
    );
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
