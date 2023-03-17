"use strict";

const API = process.env.PIXELA_API

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../helpers/apiError");



/** Related functions for use with Pixela API. */

class Pixela {
  /**
   * 
   * User token needs saved in DB
   * Check if user exists on Pixela
   * If updating password, update in both places
   * 
   * Use of this API should be when registering for the site at beginning, otherwise a regular login will make these routes available
   */




  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async createUser({ username, token}) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
           )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [username, hashedPassword, firstName, lastName, email]
    );

    const user = result.rows[0];

    return user;
  }

  }

module.exports = User;
