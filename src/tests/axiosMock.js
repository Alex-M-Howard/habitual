import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const categories = [
  {
    habitId: 1,
    habitName: "Drink 8 glasses of water",
    categoryId: 5,
    categoryName: "Health",
    permanent: true,
  },
  {
    habitId: 2,
    habitName: "Exercise for 30 minutes",
    categoryId: 5,
    categoryName: "Health",
    permanent: true,
  },
  {
    habitId: 3,
    habitName: "Eat a healthy breakfast",
    categoryId: 1,
    categoryName: "Morning",
    permanent: true,
  },
  {
    habitId: 4,
    habitName: "Meditate for 10 minutes",
    categoryId: 4,
    categoryName: "Self Care",
    permanent: true,
  },
  {
    habitId: 5,
    habitName: "Read for 20 minutes",
    categoryId: 2,
    categoryName: "Afternoon",
    permanent: true,
  },
  {
    habitId: 6,
    habitName: "Write in a journal for 10 minutes",
    categoryId: 4,
    categoryName: "Self Care",
    permanent: true,
  },
  {
    habitId: 7,
    habitName: "Take a walk for 20 minutes",
    categoryId: 5,
    categoryName: "Health",
    permanent: true,
  },
  {
    habitId: 8,
    habitName: "Practice gratitude",
    categoryId: 4,
    categoryName: "Self Care",
    permanent: true,
  },
  {
    habitId: 9,
    habitName: "Stretch for 10 minutes",
    categoryId: 5,
    categoryName: "Health",
    permanent: true,
  },
  {
    habitId: 10,
    habitName: "Floss your teeth",
    categoryId: 3,
    categoryName: "Night",
    permanent: true,
  },
  {
    habitId: 11,
    habitName: "Take a multivitamin",
    categoryId: 1,
    categoryName: "Morning",
    permanent: true,
  },
  {
    habitId: 12,
    habitName: "Track your daily expenses",
    categoryId: 7,
    categoryName: "Work",
    permanent: true,
  },
  {
    habitId: 13,
    habitName: "Learn a new word",
    categoryId: 6,
    categoryName: "School",
    permanent: true,
  },
  {
    habitId: 14,
    habitName: "Do something kind",
    categoryId: 9,
    categoryName: "Social",
    permanent: true,
  },
  {
    habitId: 15,
    habitName: "Avoid checking phone for 1 hour",
    categoryId: 7,
    categoryName: "Work",
    permanent: true,
  },
  {
    habitId: 16,
    habitName: "Practice deep breathing",
    categoryId: 4,
    categoryName: "Self Care",
    permanent: true,
  },
  {
    habitId: 17,
    habitName: "Learn a new skill or hobby",
    categoryId: 4,
    categoryName: "Self Care",
    permanent: true,
  },
  {
    habitId: 18,
    habitName: "Clean bathroom",
    categoryId: 8,
    categoryName: "Home",
    permanent: true,
  },
  {
    habitId: 19,
    habitName: "Have date night",
    categoryId: 9,
    categoryName: "Social",
    permanent: true,
  },
  {
    habitId: 20,
    habitName: "Call a friend",
    categoryId: 9,
    categoryName: "Social",
    permanent: true,
  },
  {
    habitId: 21,
    habitName: "Laundry",
    categoryId: 8,
    categoryName: "Home",
    permanent: true,
  },
  {
    habitId: 22,
    habitName: "Study",
    categoryId: 6,
    categoryName: "School",
    permanent: true,
  },
  {
    habitId: 23,
    habitName: "Read news",
    categoryId: 2,
    categoryName: "Afternoon",
    permanent: true,
  },
];

const userHabits = [
  {
    habitId: 1,
    habitName: "Drink 8 glasses of water",
    frequency: 1,
  },
  {
    habitId: 12,
    habitName: "Track your daily expenses",
    frequency: 1,
  },
  {
    habitId: 15,
    habitName: "Avoid checking phone for 1 hour",
    frequency: 1,
  },
  {
    habitId: 21,
    habitName: "Laundry",
    frequency: 1,
  },
  {
    habitId: 22,
    habitName: "Study",
    frequency: 1,
  },
  {
    habitId: 28,
    habitName: "Bird Watch",
    frequency: 1,
  },
  {
    habitId: 29,
    habitName: "I want to do all kinds of things",
    frequency: 1,
  },
];

const habitLog = [
  {
    id: 2456,
    userId: 1,
    habitId: 15,
    date: "2023-04-15T04:00:00.000Z",
    dayId: 6,
  },
  {
    id: 2457,
    userId: 1,
    habitId: 22,
    date: "2023-04-15T04:00:00.000Z",
    dayId: 6,
  },
  {
    id: 2458,
    userId: 1,
    habitId: 1,
    date: "2023-04-15T04:00:00.000Z",
    dayId: 6,
  },
];

jest.mock("api/habit_categories", () => {
  fetchHabits: () => Promise.resolve(userHabits);
  fetchCategories: () => Promise.resolve(categories);
  fetchTodayHabitLog: () => Promise.resolve(habitLog);
});
