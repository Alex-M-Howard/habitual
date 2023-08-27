/* 
Journals model
- getJournals({ userId }) => { journals }
- add({ userId, date, entry }) => { journals }
- remove({ id }) => { response }
- update({ journalId, userId, entry }) => { response }
*/

"use strict";

const { db } = require("@/config/db");

/** Related functions for journals. */

class Journals {
  /** Find all journals.
   *
   * Returns {journals: [{ id, date, entry }, ...]}
   **/

  static async getJournals({ userId }) {
    const result = await db.query(
      `SELECT 
        id,
        user_id AS "userId",
        date,
        entry
      FROM journals
      WHERE user_id=$1
      ORDER BY date`,
      [userId]
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

  /** Update journal from DB. This has to check if it is allowed to be updated
   * Also has to check if other users are using journal (In case of duplicate adds)
   * @param {name} Adds a new journal
   * @returns {journals: {id, date, entry}}
   * @returns {error: "Journal not found. No operation completed."}
   * @returns {response: `Journal: ID-${id} successfully updated.`}
   *
   **/
  static async update({ journalId, userId, entry }) {
    const existingJournal = await db.query(
      `SELECT
        *
     FROM journals WHERE id = $1 AND user_id = $2`,
      [journalId, userId]
    );

    if (existingJournal.rows.length < 1) {
      return { error: "Journal not found. No operation completed." };
    }

    let result = await db.query(
      `UPDATE journals
         SET entry = $3
         WHERE id = $1 AND user_id = $2
         RETURNING id, date, entry`,
      [journalId, userId, entry]
    );
    const journal = result.rows[0];

    if (!journal) {
      return {
        error: `Journal: ID-${journalId} not found. Update unsuccessful`,
      };
    }

    return { response: `Journal: ID-${journalId} successfully updated.` };
  }
}

module.exports = Journals;
