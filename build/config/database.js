"use strict";

// backend/config/database.js
require('dotenv').config();
var mysql = require('mysql2/promise');

// Create a connection pool with a limit of 10
var pool = mysql.createPool({
  uri: process.env.DB_URL,
  connectionLimit: 10
});
module.exports = pool;