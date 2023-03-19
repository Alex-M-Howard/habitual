"use strict";

const {db, BCRYPT_WORK_FACTOR} = require("../config/db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../helpers/apiError");
const bcrypt = require("bcrypt");
const date = require('date-and-time');

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate({ email, password }) {
    // try to find the user first
    const result = await db.query(
      `
      SELECT     
        password,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        date_joined AS "dateJoined"
      FROM users
      WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  /** Register user with data.
   *
   * Returns { firstName, lastName, email, dateJoined }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({
    password,
    firstName,
    lastName,
    email
  }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const now = new Date();
    const joined = date.format(now, 'MM/DD/YYYY');

    const result = await db.query(
      `INSERT INTO users
           (password,
            first_name,
            last_name,
            email,
            date_joined
           )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING first_name AS "firstName", last_name AS "lastName", email, date_joined AS "dateJoined"`,
      [hashedPassword, firstName, lastName, email, joined]
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT 
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email
      FROM users
      ORDER BY username`
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(email) {
    const userRes = await db.query(
      `SELECT email,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        date_joined AS "dateJoined"
      FROM users
      WHERE email = $1`,
      [email]
    );

    const user = userRes.rows[0];

    if (!user) {
      return { error: `${email} not found.` };
    }

    return {user};
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email }
   *
   * Returns { username, firstName, lastName, email }
   *
   */

  static async update(email, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      email: "email"
    });
    const emailVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE email = ${emailVarIdx} 
                      RETURNING email,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                date_joined AS "dateJoined"`;
    const result = await db.query(querySql, [...values, email]);
    const user = result.rows[0];

    if (!user) {
      return { error: `${email} not found. Update unsuccessful` };
    }

    delete user.password;
    return { user }
  }

  /** Delete given user from database */

  static async remove(email) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE email = $1
           RETURNING email`,
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return {error: `${email} not found. Delete unsuccessful`}
    }

    return { response: `User ${email} successfully deleted.` };
  }


  /**
   * Get user habits
   * 
   */

  /**
   * Create new user habit
   * 
   */

  /**
   * Log user habit
   * 
   */

  /**
   * Delete user habit
   * 
   */

  

}
module.exports = User;
