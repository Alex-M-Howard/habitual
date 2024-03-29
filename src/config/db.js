"use strict";

const { Pool } = require("pg");

const SECRET_KEY = process.env.NEXTAUTH_SECRET;
const PGPASSWORD = process.env.PGPASSWORD;
const PGUSER = process.env.PGUSER;
const DBHOST = process.env.PGHOST;
const DBPORT = process.env.PGPORT;

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "habitual_test"
    : process.env.PGDATABASE;
}

let db;
let dbUri = getDatabaseUri();

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@${DBHOST}:${DBPORT}/${dbUri}`;

const poolConfig = {
  connectionString,
  ...(process.env.NODE_ENV === "production" && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  idle_in_transaction_session_timeout: 1000,
};

db = new Pool(poolConfig);

db.connect();

module.exports = {
  db,
  BCRYPT_WORK_FACTOR,
  SECRET_KEY,
};
