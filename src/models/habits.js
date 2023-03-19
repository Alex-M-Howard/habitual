"use strict";

const { db } = require("@/config/db");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for habits. */

class Habits {
  /** Find all habits.
   *
   * Returns {habits: [{ id, name }, ...]}
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


  /**
   * 
   * @param {name} Adds a new habit 
   * @returns {habits: {id, name}}
   */
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
    RETURNING id, name
    `,
      [name]
    );

    return { habits: result.rows[0] };
  }

  /** Delete habit from DB. This has to check if it is allowed to be deleted
   * Also has to check if other users are using habit (In case of duplicate adds)
   */

  static async remove({id}) {
    const existingHabit = await db.query(
      `SELECT
          id,
          name,
          do_not_delete AS "doNotDelete" 
       FROM habits WHERE id = $1`,
      [id]
    );
      console.log(existingHabit)
    if (existingHabit.rows.length < 1) {
      return { error: "Habit not found. No operation completed." };
    }

    if (existingHabit.rows[0].doNotDelete) {
      return { error: "Habit has permanent status. No operation completed." };
    }

    const userHabits = await db.query(
      `SELECT
          user_id AS "userId",
          habit_id AS "habitId"
       FROM user_habits
       WHERE habit_id = $1`,
      [id]
    );

    if (userHabits.rows.length > 0) {
      return { error: "Habit still in use by user. No operation completed." };
    }


    let result = await db.query(
      `DELETE
           FROM habits
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const habit = result.rows[0];

    if (!habit) {
      return {error: `Habit: ID-${id} not found. Delete unsuccessful`}
    }

    return { response: `Habit: ID-${id} successfully deleted.` };
  }
}
module.exports = Habits;
