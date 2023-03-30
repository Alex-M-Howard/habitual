"use strict";

const { db } = require("@/config/db");

/** Related functions for journals. */

class Journals {
  /** Find all journals.
   *
   * Returns {journals: [{ id, date, entry }, ...]}
   **/

  static async getJournals({ id }) {
    const result = await db.query(
      `SELECT 
        id,
        date,
        entry
      FROM journals
      WHERE user_id=$1
      ORDER BY date`,
      [id]
    );

    return { journals: result.rows };
  }

  /**
   *
   * @param {name} Adds a new journal
   * @returns {journals: {id, date, entry}}
   */
  static async add({ userId, date = new Date(), entry }) {
    const result = await db.query(
      `INSERT INTO journals (user_id, date, entry)
    VALUES ($1, $2, $3)
    RETURNING id, date, entry
    `,
      [userId, date, entry]
    );

    return { journals: result.rows[0] };
  }

  /** Delete journal from DB. This has to check if it is allowed to be deleted
   * Also has to check if other users are using journal (In case of duplicate adds)
   */

  static async remove({ id }) {
    const existingJournal = await db.query(
      `SELECT
          *
       FROM journals WHERE id = $1`,
      [id]
    );

    if (existingJournal.rows.length < 1) {
      return { error: "Journal not found. No operation completed." };
    }

    let result = await db.query(
      `DELETE
           FROM journals
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const journal = result.rows[0];

    if (!journal) {
      return { error: `Journal: ID-${id} not found. Delete unsuccessful` };
    }

    return { response: `Journal: ID-${id} successfully deleted.` };
  }
}

module.exports = Journals;
