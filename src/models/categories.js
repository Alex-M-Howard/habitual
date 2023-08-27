/*
Categories model:
  - findAll() => { categories }
  - add({ name }) => { category }
  - remove({ id }) => { response }
*/

"use strict";

const { db } = require("@/config/db");

/** Related functions for categories. */
class Categories {
  /**
   * Find all categories.
   *
   * @returns {Object} - An object containing an array of categories, where each category has an id and name.
   */
  static async findAll() {
    const result = await db.query(
      `SELECT 
        id,
        name,
        do_not_delete AS "permanent"
      FROM categories
      ORDER BY id`
    );

    return { categories: result.rows };
  }

  /**
   * Adds a new category to the database.
   *
   * @param {string} name - The name of the category to be added.
   * @returns {Object} - An object containing the newly added category's id and name.
   */
  static async add({ name }) {
    // Check if category already exists
    const existingCategory = await db.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );

    if (existingCategory.rows.length > 0) {
      return { error: "Category already exists." };
    }

    const result = await db.query(
      `INSERT INTO categories (name)
    VALUES ($1)
    RETURNING id, name
    `,
      [name]
    );

    return { categories: result.rows[0] };
  }

  /**
   * Deletes a category from the database.
   *
   * @param {number} id - The id of the category to be removed.
   * @returns {Object} - An object indicating the status of the delete operation.
   */
  static async remove({ id }) {
    // Check if category exists. If not, return error.
    const existingCategories = await db.query(
      `SELECT
          id,
          name,
          do_not_delete AS "doNotDelete" 
       FROM categories WHERE id = $1`,
      [id]
    );

    if (existingCategories.rows.length < 1) {
      return { error: "Category not found. No operation completed." };
    }

    // Default categories cannot be deleted
    if (existingCategories.rows[0].doNotDelete) {
      return {
        error: "Category has permanent status. No operation completed.",
      };
    }

    // Check if category is still in use by a habit. If so, return error.
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

    return { response: `Category ID: ${id} successfully deleted.` };
  }
}

module.exports = Categories;
