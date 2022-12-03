const { Client } = require("pg");
require("dotenv").config();

const db = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  url: process.env.DB_URL,
});

module.exports = db;
