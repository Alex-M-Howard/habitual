-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS habitual;

-- Connect to the database
\c habitual;

-- Drop all tables if they exist
DROP TABLE IF EXISTS user_habits;
DROP TABLE IF EXISTS habit_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS journals;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS days;
DROP TABLE IF EXISTS users;

-- Create the tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255),
  date_joined VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description VARCHAR(255)
);

CREATE TABLE journals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  entry VARCHAR(255)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

CREATE TABLE habit_categories (
  habit_id INTEGER REFERENCES habits(id),
  category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE user_habits (
  user_id INTEGER REFERENCES users(id),
  habit_id INTEGER REFERENCES habits(id),
  frequency INTEGER
);

CREATE TABLE days (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

INSERT INTO days (name) VALUES
  ('Monday'),
  ('Tuesday'),
  ('Wednesday'),
  ('Thursday'),
  ('Friday'),
  ('Saturday'),
  ('Sunday');