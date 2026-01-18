const mysql = require("mysql2/promise");
require("dotenv").config();

let db;

if (process.env.NODE_ENV === "test") {
    // Use a local test database
    db = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "",
        database: "test_harmonessens",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
    console.log("Using MySQL test database");
} else {
    console.log(
        "host:", process.env.DB_HOST,
        "user:", process.env.DB_USER,
        "password:", process.env.DB_PASS,
        "database:", process.env.DB_NAME,
    )

    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });
    console.log("Connected to MySQL database");
}

const checkAndCreateTables = async () => {
    const createServicesTableQuery = `
    CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        description TEXT NOT NULL,
        length INT NOT NULL,
        price INT NOT NULL,
        allowOnline TINYINT(1) NOT NULL DEFAULT 0,
        isActive TINYINT(1) NOT NULL DEFAULT 1
    );
    `;

    try {
        await db.execute(createServicesTableQuery);
        console.log("MySQL tables checked/created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error.message);
    }
};

module.exports = { db, checkAndCreateTables };
