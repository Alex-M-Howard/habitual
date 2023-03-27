"use strict";

const { db } = require("@/config/db");

/** Related functions for categories. */

class Categories {
  /** Find all categories.
   *
   * Returns {categories: [{ id, name }, ...]}
   **/

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
   * 
   * @param {name} Adds a new category
   * @returns {categories: {id, name}}
   */
  static async add({ name }) {
    const existingCategory = await db.query(
      `SELECT * FROM categories WHERE name = $1`,
      [name]
    );

    if (existingCategory.rows.length > 0) {
      // A categorie with this name already exists in the database
      return { error: 'Category already exists.' };
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

  /** Delete category from DB. This has to check if it is allowed to be deleted
   * Also has to check if habits are using category (In case of duplicate adds)
   */

  static async remove({id}) {
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

    if (existingCategories.rows[0].doNotDelete) {
      return { error: "Category has permanent status. No operation completed." };
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
      return { error: "Category still in use by habit. No operation completed." };
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
      return {error: `Category ID: ${id} not found. Delete unsuccessful`}
    }

    return { response: `Categories ID: ${id} successfully deleted.` };
  }
}
module.exports = Categories;
