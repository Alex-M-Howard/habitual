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
DROP TABLE IF EXISTS tracker;

-- Create the tables
CREATE TABLE users (
id SERIAL PRIMARY KEY,
first_name VARCHAR(255),
last_name VARCHAR(255),
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
name VARCHAR(255),
do_not_delete BOOLEAN DEFAULT false
);

CREATE TABLE habit_categories (
habit_id INTEGER REFERENCES habits(id),
category_id INTEGER REFERENCES categories(id),
do_not_delete BOOLEAN DEFAULT false
);

CREATE TABLE user_habits (
user_id INTEGER REFERENCES users(id),
habit_id INTEGER REFERENCES habits(id),
frequency INTEGER,
streak INTEGER DEFAULT 0,
longest_streak INTEGER DEFAULT 0
);

CREATE TABLE days (
id SERIAL PRIMARY KEY,
name VARCHAR(255)
);

CREATE TABLE tracker (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  habit_id INTEGER REFERENCES habits(id),
  day_date DATE,
  day_id INTEGER REFERENCES days(id),
  complete BOOLEAN DEFAULT false
);


-- Add values
INSERT INTO days (name) 
VALUES
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');


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
('Call a friend', TRUE),
('Laundry', TRUE),
('Study', TRUE),
('Read news', TRUE);

INSERT INTO categories (name, do_not_delete)
VALUES
('Morning', TRUE),
('Afternoon', TRUE),
('Night', TRUE),
('Self Care', TRUE),
('Health', TRUE),
('School', TRUE),
('Work', TRUE),
('Home', TRUE),
('Social', TRUE);

INSERT INTO habit_categories (habit_id, category_id, do_not_delete)
VALUES
(1, 5, TRUE),
(2, 5, TRUE),
(3, 1, TRUE),
(4, 4, TRUE),
(5, 2, TRUE),
(6, 4, TRUE),
(7, 5, TRUE),
(8, 4, TRUE),
(9, 5, TRUE),
(10, 3, TRUE),
(11, 1, TRUE),
(12, 7, TRUE),
(13, 6, TRUE),
(14, 9, TRUE),
(15, 7, TRUE),
(16, 4, TRUE),
(17, 4, TRUE),
(18, 8, TRUE),
(19, 9, TRUE),
(20, 9, TRUE),
(21, 8, TRUE),
(22, 6, TRUE),
(23, 2, TRUE);

INSERT INTO users (first_name, last_name, password, date_joined, email)
VALUES
('Alex', 'Howard', '$2b$13$/WEgEKl/JWJ98p3KjYDT7e.1hZ20hLfKXyGOgF3ljp7XqHdlQJZ5q', '2023-03-15', 'alexamh@zoho.com'),
('Guest', 'User', '$2b$13$QHWMmC5g.II5ehmZ1sGePugzDdg8pZUg9amwcXagLIyfhVD2lbeyi', '2023-03-15', 'guest@guest.com'); --Guest password is 'password'
