/*
 User model
  - authenticate({ email, password }) => { user }
  - register({ email, password, firstName, lastName }) => { user }
  - get(userId) => { user }
  - update(data) => { user }
  - remove(email) => { response }
  - getUserHabits(userId) => { habits }
  - addUserHabit({ userId, habitId, frequency }) => { userHabit }
  - removeUserHabit({ userId, habitId }) => { response }
  - getUserLog(userId) => { log }
  - getUserLogToday(userId) => { log }
  - logUserHabit({ userId, habitId, date }) => { response }
  - removeLoggedUserHabit({ logId }) => { response }
  - cleanData() => { response } ** Meant to clean guest data to prevent bad actors from messing with the demo
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

/** Related functions for users. */

class User {
  /**
   *
   * @param {OBJ{email:string, password:string}} {email, password}
   * @returns {user: {firstName, lastName, email, date_joined}}
   */
  static async authenticate({ email, password }) {
    // try to find the user first
    const result = await db.query(
      `
      SELECT
        id,     
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

  /**
   *
   * @param {{string, string, string, string}} {password, firstName, lastName, email}
   * @returns {user:{firstName, lastName, email, dateJoined}}
   */
  static async register({ password, firstName, lastName, email }) {
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
    const joined = date.format(now, "MM/DD/YYYY");

    const result = await db.query(
      `INSERT INTO users
           (password,
            first_name,
            last_name,
            email,
            date_joined
           )
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, first_name AS "firstName", last_name AS "lastName", email, date_joined AS "dateJoined"`,
      [hashedPassword, firstName, lastName, email, joined]
    );

    const user = result.rows[0];

    return user;
  }

  /**
   *
   * @returns {user: {id, firstName, lastName, email, dateJoined, habits: []}}
   * @param userId
   */
  static async get(userId) {
    const userRes = await db.query(
      `SELECT 
        id,
        email,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        date_joined AS "dateJoined"
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    const user = userRes.rows[0];

    if (!user) return { error: `${email} not found.` };

    let response = await User.getUserHabits(user.id);
    user.habits = response.habits;

    return { user };
  }

  /**
   *
   * @param {string} email
   * @param {{OBJ}} data - Can contain various keys to change
   * @returns  {user: {firstName, lastName, email, dateJoined}}
   */
  static async update(data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
    });

    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                email,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                date_joined AS "dateJoined"`;
    const result = await db.query(querySql, [...values, data.id]);
    const user = result.rows[0];

    if (!user) {
      return { error: `User ${id} not found. Update unsuccessful` };
    }

    delete user.password;
    return { user };
  }

  /**
   *
   * @param {string} email
   * @returns {response: "User [id] successfully deleted"}
   */
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
      return { error: `${email} not found. Delete unsuccessful` };
    }

    return { response: `User ${email} successfully deleted.` };
  }

  /**
   *
   * @param {int} id
   * @returns {habits: []}
   */
  static async getUserHabits(userId) {
    const userHabits = await db.query(
      `SELECT 
      habit_id AS "habitId",
      habits.name AS "habitName",
      frequency
      FROM user_habits
      JOIN habits ON habits.id=habit_id
      WHERE user_id=$1
      `,
      [userId]
    );

    let habits = userHabits.rows;

    return { habits };
  }

  /**
   *
   * @param {{int, int, int}} {userId, habitId, frequency}
   * @returns {userId, habitId, frequency, streak, longestStreak}
   */
  static async addUserHabit({ userId, habitId, frequency }) {
    const existanceCheck = await db.query(
      `
      SELECT * 
      FROM user_habits
      WHERE user_id = $1 AND habit_id = $2
      `,
      [userId, habitId]
    );

    if (existanceCheck.rows.length > 0) {
      return {
        error: `User ${userId} already has habit ${habitId}. No operations performed.`,
      };
    }

    const userHabits = await db.query(
      `INSERT INTO user_habits (user_id, habit_id, frequency)
       VALUES
       ($1, $2, $3)
       RETURNING
        user_id AS "userId",
        habit_id AS "habitId",
        frequency
      `,
      [userId, habitId, frequency]
    );

    return userHabits.rows;
  }

  /**
   *  Get user habit log
   */
  static async getUserLog(userId) {
    const existanceCheck = await db.query(
      `
      SELECT * FROM users WHERE id=$1`,
      [userId]
    );

    if (existanceCheck.rows.length < 1) {
      return { error: `User: ${userId} not found.` };
    }

    const userLog = await db.query(
      `
      SELECT id,
      user_id AS "userId",  
      habit_id AS "habitId",
      day_date AS "date",
      day_id AS "dayId"  
      FROM tracker
      WHERE user_id=$1 AND day_date=$2`,
      [userId]
    );

    return { log: userLog.rows };
  }

  /**
   *  Get user habit log
   */
  static async getUserLogToday(userId) {
    
    const existanceCheck = await db.query(
      `
      SELECT * FROM users WHERE id=$1`,
      [userId]
    );

    if (existanceCheck.rows.length < 1) {
      return { error: `User: ${userId} not found.` };
    }

    const todayDate = date.format(new Date(), "MM/DD/YYYY");

    const userLog = await db.query(
      `
      SELECT 
      id,
      user_id AS "userId",  
      habit_id AS "habitId",
      day_date AS "date",
      day_id AS "dayId"  
      FROM tracker
      WHERE user_id=$1 AND day_date=$2`,
      [userId, todayDate]
    );

    return { log: userLog.rows };
  }

  /**
   * Log user habit
   *
   */
  static async logUserHabit({ userId, habitId, date = new Date() }) {
    let response;

    const existanceUserHabitCheck = await db.query(
      `
      SELECT *
      FROM user_habits
      WHERE user_id=$1 AND habit_id=$2
      `,
      [userId, habitId]
    );

    if (existanceUserHabitCheck.rows.length < 1) {
      return {
        error: `User: ${userId} has no habit: ${habitId}. not found. No operation performed.`,
      };
    }

    const existanceTrackerCheck = await db.query(
      `
      SELECT *
      FROM tracker
      WHERE user_id=$1 AND habit_id=$2 AND day_date=$3`,
      [userId, habitId, date]
    );

    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (existanceTrackerCheck.rows.length > 0) {
      response = await db.query(
        `
        UPDATE tracker
        SET complete = true
        WHERE user_id=$1 AND habit_id=$2 AND day_date=$3
        RETURNING *`,
        [userId, habitId, date]
      );
    } else {
      const dateOptions = { weekday: "long" };
      const dayName = date.toLocaleString("en-US", dateOptions);

      let dayId = await db.query("SELECT id FROM days WHERE name = $1", [
        dayName,
      ]);
      dayId = dayId.rows[0].id;

      response = await db.query(
        `
        INSERT INTO tracker (user_id, habit_id, day_date, day_id, complete)
        VALUES
          ($1, $2, $3, $4, true)
        RETURNING *`,
        [userId, habitId, date, dayId]
      );
    }

    return { response: response.rows };
  }

  /**
   * Log user habit
   *
   */
  static async removeLoggedUserHabit({ logId}) {
    let response;

    const existanceCheck = await db.query(
      `
      SELECT *
      FROM tracker
      WHERE id=$1
      `,
      [logId]
    );

    if (existanceCheck.rows.length < 1) {
      return {
        error: `Log: ${logId} not found. No operation performed.`,
      };
    }
    response = await db.query(
      `
        DELETE FROM tracker WHERE id=$1
        RETURNING *`,
      [logId]
    );
    return { response: response.rows, message: "Log successfully deleted" };
  }

  /**
   *
   * @param {int} userId
   * @param {int} habitId
   * @returns {response: "UserHabit successfully deleted"}
   */
  static async removeUserHabit({ userId, habitId }) {
    let result = await db.query(
      `DELETE
           FROM user_habits
           WHERE user_id = $1 AND habit_id = $2
           RETURNING user_id, habit_id
      `,
      [userId, habitId]
    );

    if (result.rows.length < 1) {
      return {
        error: `User: ${userId} had no existing habit: ${habitId}. No operations performed.`,
      };
    }

    return { response: `User habit successfully deleted.` };
  }

  /**
   *
   * @returns {response: "Guest data successfully deleted"}
   */
  static async cleanData() {

    // Delete everything that previous guest might have entered. Then seed generic data in for guest.
    console.log('cleaning data')
    const userIdResult = await db.query(`SELECT id FROM users WHERE email = 'guest@guest.com'`);
    const userId = userIdResult.rows[0].id;

    // Delete existing data
    await db.query(`DELETE FROM tracker WHERE user_id = $1`, [userId]);
    await db.query(`DELETE FROM user_habits WHERE user_id = $1`, [userId]);
    await db.query(`DELETE FROM journals WHERE user_id = $1`, [userId]);

    console.log('deleted data')
    // Insert default habit data
    const defaultHabits = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    ];

    for (const habitId of defaultHabits) {
        await db.query(`INSERT INTO user_habits (user_id, habit_id, frequency) VALUES ($1, $2, 1)`, [userId, habitId]);
    }

    // Insert default journal entries
    const defaultJournals = [
      {
          date: new Date(),
          entry: 'Welcome to HabitTracker! This is a demo journal entry. Feel free to delete it and add your own!'
        },
        {
            date: new Date(),
            entry: 'HabitTracker is a simple app to help you track your habits. You can add habits, log them, and view your progress. You can also add journal entries to keep track of your thoughts and feelings. Feel free to delete this journal entry and add your own!'
        }
    ];

    for (const journal of defaultJournals) {
        await db.query(`INSERT INTO journals (user_id, date, entry) VALUES ($1, $2, $3)`, [userId, journal.date, journal.entry]);
    }

    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    const completedHabits = [];
    for (let i = 0; i < 75; i++) {
      const randomDate = new Date(oneYearAgo.getTime() + Math.random() * (currentDate.getTime() - oneYearAgo.getTime()));
      const habitId = Math.floor(Math.random() * 10) + 1; // Random habit ID between 1 and 10

      completedHabits.push({
          userId,
          habitId,
          date: randomDate
      });
  }

  for (const habitEntry of completedHabits) {
    const dateOptions = { weekday: 'long' };
    const dayName = habitEntry.date.toLocaleString('en-US', dateOptions);

    let dayIdResult = await db.query('SELECT id FROM days WHERE name = $1', [dayName]);
    let dayId = dayIdResult.rows[0].id;

    db.query(
        `
        INSERT INTO tracker (user_id, habit_id, day_date, day_id, complete)
        VALUES ($1, $2, $3, $4, true)
        RETURNING *`,
        [habitEntry.userId, habitEntry.habitId, habitEntry.date, dayId]
    );
}


    return { response: 'Guest Data Scrubbed' };
}

}

module.exports = User;
