import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import Data from "@/models/data";

export default async function handler(req, res) {
  let token, user, response, validator;

  // Middleware Checks
  try {
    token = ensureLoggedIn(req);
    user = authenticateJWT(token);

    if (!user) throw new Error();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Request Method Switch
  switch (req.method) {
    case "GET":
      const user = {}
      try {
        const mostCompletedHabits = await Data.getMostCompletedHabit(req.query);
        const mostCompletedHabits30 = await Data.getMostCompletedHabitLast30(
          req.query
        );
        const mostCompletedHabits60 = await Data.getMostCompletedHabitLast60(req.query);
        const mostCompletedHabits90 = await Data.getMostCompletedHabitLast90(req.query);
        const mostCompletedHabits180 = await Data.getMostCompletedHabitLast180(req.query);
        const mostCompletedHabits365 = await Data.getMostCompletedHabitLast365(req.query);
        const habitsCompletedByDay = await Data.getHabitsCompletedByDay(req.query);
        const habitCategoryMostCompleted = await Data.getHabitCategoryMostCompleted(req.query);
        const streaks = await Data.getUserStreaks(req.query);

        user.mostCompletedHabits = mostCompletedHabits;
        user.mostCompletedHabits30 = mostCompletedHabits30;
        user.mostCompletedHabits60 = mostCompletedHabits60;
        user.mostCompletedHabits90 = mostCompletedHabits90;
        user.mostCompletedHabits180 = mostCompletedHabits180;
        user.mostCompletedHabits365 = mostCompletedHabits365;
        user.habitsCompletedByDay = habitsCompletedByDay;
        user.habitCategoryMostCompleted = habitCategoryMostCompleted;
        user.streaks = streaks;

        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
