const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "loaded" : "MISSING");