const sqlite3 = require("better-sqlite3");
const path = require("path");

let db;
try {
	//Path for local dev db
	const dbPath = path.join(__dirname, "../data/harmonessensDB.sqlite");
	db = new sqlite3(dbPath);
	console.log("Created db using dirname");
}
catch {
	//Path for Render db
	const dbPath = path.join("/data", "harmonessensDB.sqlite");
	db = new sqlite3(dbPath);
	console.log("Created db using /data");
}

// Function to create tables if they don’t exist
const checkAndCreateTables = () => {
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
		db.exec(createServicesTableQuery);
		console.log("SQLite tables checked/created successfully.");
	} catch (error) {
		console.error("Error creating tables:", error.message);
	}
};

module.exports = { db, checkAndCreateTables };
