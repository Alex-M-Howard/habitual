"use strict";

const { Client } = require("pg");

const SECRET_KEY = process.env.SECRET_KEY;
const PGPASSWORD = process.env.PGPASSWORD;
const PGUSER = process.env.PGUSER;
const DBHOST = process.env.PGHOST;
const DBPORT = process.env.PGPORT;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "habitual_test"
      : process.env.PGDATABASE;
}

let db;
let dbUri = getDatabaseUri();

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${DBHOST}:${DBPORT}/${dbUri}`;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  db = new Client({
    connectionString
  });
}

console.log("Jobly Config: ");
console.log("BCRYPT_WORK_FACTOR: ", BCRYPT_WORK_FACTOR);
console.log("Database: ", dbUri);
console.log("---");

db.connect();

module.exports = {
  db,
  BCRYPT_WORK_FACTOR
};
