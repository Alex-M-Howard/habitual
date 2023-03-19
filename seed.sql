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
  date_joined DATE,
  email VARCHAR(255)
);

CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  do_not_delete BOOLEAN DEFAULT false
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



-- SEED INTO HABITS and CATEGORIES

INSERT INTO habits (name, do_not_delete) 
VALUES 
('Drink 8 glasses of water', TRUE),
('Exercise for 30 minutes', TRUE),
('Eat a healthy breakfast', TRUE),
('Meditate for 10 minutes', TRUE),
('Read for 20 minutes', TRUE),
('Write in a journal for 10 minutes', TRUE),
('Take a walk for 20 minutes', TRUE),
('Practice gratitude', TRUE),
('Stretch for 10 minutes', TRUE),
('Floss your teeth', TRUE),
('Take a multivitamin', TRUE),
('Track your daily expenses', TRUE),
('Learn a new word', TRUE),
('Do something kind', TRUE),
('Avoid checking phone for 1 hour', TRUE),
('Practice deep breathing', TRUE),
('Learn a new skill or hobby', TRUE),
('Clean bathroom', TRUE),
('Have date night', TRUE),
('Call a friend', TRUE);

INSERT INTO categories(name)
VALUES
('Morning'),
('Afternoon'),
('Night'),
('Self Care'),
('Health'),
('School'),
('Work'),
('Home'),
('Social');