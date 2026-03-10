const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "solart",
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dessins (
      id VARCHAR(64) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      tags TEXT NOT NULL,
      createdAt DATE NOT NULL,
      image LONGBLOB NULL,
      imageMime VARCHAR(100) NULL,
      imageName VARCHAR(255) NULL
    )
  `);
}

module.exports = { pool, initDb };