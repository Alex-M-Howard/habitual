/*
  Data model
  - getMostCompletedHabit({ userId }) => { habits }
  - getMostCompletedHabits({ userId }, interval) => { habits }
  - getHabitsCompletedByDay({ userId }) => { days }
  - getHabitCategoryMostCompleted({ userId }) => { categories }
  - getUserStreaks({ userId }) => { streaks }
*/

"use strict";

const { db, BCRYPT_WORK_FACTOR } = require("../config/db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../helpers/apiError");
const bcrypt = require("bcrypt");
const date = require("date-and-time");

class Data {
  /**
   * Get the most completed habits for a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Array} - An array containing habit names and their completion counts.
   * @throws {NotFoundError} - If the user is not found.
   */
  static async getMostCompletedHabit({ userId }) {
    // Check if the user exists.
    const userCheck = await db.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userCheck.rows.length === 0) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }

    // Retrieve the most completed habits for the user.
    const result = await db.query(
      `
      SELECT
      habits.name,
      COUNT(habits.name) AS "count"
      FROM habits
      JOIN tracker ON habits.id = tracker.habit_id
      WHERE tracker.user_id = $1
      GROUP BY habits.name
      ORDER BY COUNT(habits.name) DESC
      LIMIT 5`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Get the most completed habits for a user within a specified interval.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} interval - The interval for which to retrieve data (e.g., '30 days').
   * @returns {Array} - An array containing habit names and their completion counts.
   * @throws {NotFoundError} - If the user is not found.
   */
  static async getMostCompletedHabits({ userId }, interval) {
    // Check if the user exists.
    const userCheck = await db.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userCheck.rows.length === 0) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }

    // Retrieve the most completed habits within the specified interval for the user.
    const result = await db.query(
      `
      SELECT
      habits.name,
      COUNT(habits.name) AS "count"
      FROM habits
      JOIN tracker ON habits.id = tracker.habit_id
      WHERE tracker.user_id = $1 AND tracker.day_date >= NOW() - INTERVAL '${interval} days'
      GROUP BY habits.name
      ORDER BY COUNT(habits.name) DESC
      LIMIT 5`,
      [userId]
    );

    return result.rows;
  }

  /**
   * Get habits completed by day for a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Array} - An array containing day names and their completion counts.
   * @throws {NotFoundError} - If the user is not found.
   */
  static async getHabitsCompletedByDay({ userId }) {
    // Check if the user exists.
    const userCheck = await db.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userCheck.rows.length === 0) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }

    // Retrieve habits completed by day for the user.
    const result = await db.query(
      `
      SELECT
      days.name,
      COUNT(days.name) AS "count"
      FROM days
      JOIN tracker ON days.id = tracker.day_id
      WHERE tracker.user_id = $1
      GROUP BY days.id
      ORDER BY days.id ASC
      `,
      [userId]
    );

    return result.rows;
  }
  /**
   * Get the most completed habit categories for a user.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Array} - An array containing category names and their completion counts.
   * @throws {NotFoundError} - If the user is not found.
   */
  static async getHabitCategoryMostCompleted({ userId }) {
    // Check if the user exists.
    const userCheck = await db.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userCheck.rows.length === 0) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }

    // Retrieve the most completed habit categories for the user.
    const result = await db.query(
      `
    SELECT
    categories.name,
    COUNT(categories.name) AS "count"
    FROM categories
    JOIN habit_categories ON categories.id = habit_categories.category_id
    JOIN tracker ON habit_categories.habit_id = tracker.habit_id
    WHERE tracker.user_id = $1
    GROUP BY categories.name
    ORDER BY categories.name ASC
    `,
      [userId]
    );

    return result.rows;
  }

  /**
   * Get streak information for a user's habits.
   *
   * @param {number} userId - The ID of the user.
   * @returns {Array} - An array containing streak information for user's habits.
   * @throws {NotFoundError} - If the user is not found.
   */
  static async getUserStreaks({ userId }) {
    // Check if the user exists.
    const userCheck = await db.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userCheck.rows.length === 0) {
      throw new NotFoundError(`No user found with id ${userId}`);
    }

    // Retrieve streak information for the user's habits.
    const result = await db.query(
      `
    WITH distinct_dates AS (
     SELECT DISTINCT user_id, habit_id, day_date
     FROM tracker
     WHERE user_id = $1
    ),
    tracker_with_streaks AS (
      SELECT
          user_id,
          habit_id,
          day_date,
        CASE
          WHEN
            day_date = LAG(day_date) OVER (PARTITION BY user_id, habit_id ORDER BY day_date) + INTERVAL '1 day'
          THEN 1
          ELSE 0
        END AS is_consecutive
      FROM distinct_dates
    ),
    streak_groups AS (
      SELECT *,
        SUM(is_consecutive) OVER (PARTITION BY user_id, habit_id ORDER BY day_date) AS streak_group
      FROM tracker_with_streaks
    ),
    streak_lengths AS (
      SELECT
      user_id,
      habit_id,
      streak_group,
      COUNT(*) AS streak_length
    FROM streak_groups
    GROUP BY user_id, habit_id, streak_group
  ),
  current_streak AS (
    SELECT
      user_id,
      habit_id,
      streak_length AS current_streak_length
    FROM streak_lengths
    WHERE (user_id, habit_id, streak_group) IN (
      SELECT
        user_id,
        habit_id,
        MAX(streak_group)
      FROM streak_groups
      GROUP BY user_id, habit_id
    )
)
SELECT
s1.user_id,
s1.habit_id,
MAX(s1.streak_length) AS longest_streak_length,
COALESCE(s2.current_streak_length, 0) AS current_streak_length
FROM streak_lengths s1
LEFT JOIN current_streak s2 ON s1.user_id = s2.user_id AND s1.habit_id = s2.habit_id
GROUP BY s1.user_id, s1.habit_id, s2.current_streak_length;
    
          
    `,
      [userId]
    );

    return result.rows;
  }
}

module.exports = Data;
