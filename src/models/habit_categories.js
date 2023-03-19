"use strict";

const { db } = require("@/config/db");

/** Related functions for habit_categories. */

class HabitCategories {
  /** Find all habit_categories.
   *
   * Returns {habitCategories: [{ habitId, habitName, categoryId, categoryName, permanent }, ...]}
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT 
        hc.habit_id AS "habitId",
        h.name AS "habitName",
        hc.category_id AS "categoryId",
        c.name AS "categoryName",
        hc.do_not_delete AS "permanent"
      FROM habit_categories hc
      JOIN habits h ON hc.habit_id=h.id
      JOIN categories c on hc.category_id=c.id
      `
    );

    return { habitCategories: result.rows };
  }

  /**
   *
   * @param {habitId, categoryId} Adds a new habit_category combo
   * @returns {habitCategories: {habitId, habitName, categoryId, categoryName, permanent}}
   */
  static async add({ habitId, categoryId }) {
    const existingHabit = await db.query(
      `SELECT * FROM habits WHERE id = $1`,
      [habitId]
    );

    if (existingHabit.rows.length < 1) return { error: "Habit doesn't exist. No operations completed." };


    const existingCategory = await db.query(
      `SELECT * FROM categories WHERE id = $1`,
      [categoryId]
    );

    if (existingCategory.rows.length < 1) return { error: "Category doesn't exist. No operations completed." };


    const existingHabitCategory = await db.query(
      `SELECT *
       FROM habit_categories
       WHERE habit_id = $1 AND category_id = $2`,
      [habitId, categoryId]
    );

    if (existingHabitCategory.rows.length > 0) return { error: "Habit/Category combo already exists." };
  

    const result = await db.query(
      `INSERT INTO habit_categories (habit_id, category_id)
       VALUES ($1, $2)
       RETURNING 
          habit_id AS "habitId",
          category_id AS "categoryId"
    `,
      [habitId, categoryId]
    );

    result.rows[0].habitName = existingHabit.rows[0].name;
    result.rows[0].categoryName = existingCategory.rows[0].name;

    return { habitCategories: result.rows[0] };
  }

  /** Delete category from DB. This has to check if it is allowed to be deleted
   * Also has to check if habits are using category (In case of duplicate adds)
   */

  static async remove({ id }) {
    const existingCategories = await db.query(
      `SELECT
          id,
          name,
          do_not_delete AS "doNotDelete" 
       FROM categories WHERE id = $1`,
      [id]
    );
    console.log(existingCategories);
    if (existingCategories.rows.length < 1) {
      return { error: "Category not found. No operation completed." };
    }

    if (existingCategories.rows[0].doNotDelete) {
      return {
        error: "Category has permanent status. No operation completed.",
      };
    }

    const habitCategories = await db.query(
      `SELECT
          habit_id AS "habitId",
          category_id AS "categoryId"
       FROM habit_categories
       WHERE category_id = $1`,
      [id]
    );

    if (habitCategories.rows.length > 0) {
      return {
        error: "Category still in use by habit. No operation completed.",
      };
    }

    let result = await db.query(
      `DELETE
           FROM categories
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const categories = result.rows[0];

    if (!categories) {
      return { error: `Category ID: ${id} not found. Delete unsuccessful` };
    }

    return { response: `Categories ID: ${id} successfully deleted.` };
  }
}
module.exports = HabitCategories;
