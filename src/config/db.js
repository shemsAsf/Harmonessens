const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const checkAndCreateTables = async () => {
  const createClientsTableQuery = `
    CREATE TABLE IF NOT EXISTS clients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) DEFAULT NULL
    );
  `;

  const createReservationsTableQuery = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INT PRIMARY KEY,
      appointmentId INT NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      comment TEXT DEFAULT NULL,
      has_paid BOOLEAN DEFAULT FALSE,
      client_id INT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );
  `;

  try {
    await db.query(createClientsTableQuery);
    await db.query(createReservationsTableQuery);
    console.log("Checked and created tables if they don't exist.");
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};

module.exports = { db, checkAndCreateTables };
