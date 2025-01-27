// backend/config/database.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool with a limit of 10
const pool = mysql.createPool({
    uri: process.env.DB_URL,
    connectionLimit: 10
});

module.exports = pool;
