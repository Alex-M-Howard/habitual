"use strict";

const { db } = require("@/config/db");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for habits. */

class Habits {
  /** Find all habits.
   *
   * Returns [{ id, name }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT 
        id,
        name,
        do_not_delete AS "permanent"
      FROM habits
      ORDER BY id`
    );

    return { habits: result.rows };
  }

  static async add({ name }) {
    const existingHabit = await db.query(
      `SELECT * FROM habits WHERE name = $1`,
      [name]
    );

    if (existingHabit.rows.length > 0) {
      // A habit with this name already exists in the database
      return { error: 'Habit already exists.' };
    }

    const result = await db.query(
      `INSERT INTO habits (name)
    VALUES ($1)
    RETURNING *
    `,
      [name]
    );

    return { habits: result.rows };
  }

  /** Delete given user from database; returns undefined. */

  // static async remove(email) {
  //   let result = await db.query(
  //     `DELETE
  //          FROM users
  //          WHERE email = $1
  //          RETURNING email`,
  //     [email]
  //   );
  //   const user = result.rows[0];

  //   if (!user) {
  //     return {error: `${email} not found. Delete unsuccessful`}
  //   }

  //   return { response: `User ${email} successfully deleted.` };
  // }
}
module.exports = Habits;
