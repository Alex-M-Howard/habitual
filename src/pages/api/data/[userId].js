import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import Data from "@/models/data";

const intervals = [30, 60, 90, 180, 365];

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

        user.mostCompletedHabits = await Data.getMostCompletedHabit(req.query);
        user.habitsCompletedByDay = await Data.getHabitsCompletedByDay(req.query);
        user.habitCategoryMostCompleted = await Data.getHabitCategoryMostCompleted(req.query);
        user.streaks = await Data.getUserStreaks(req.query);

        // Get most completed habits by interval
        for (let i = 0; i < intervals.length; i++) {
          user[`mostCompletedHabits${intervals[i]}`] = await Data.getMostCompletedHabits(req.query, intervals[i]);
        }

        return res.status(200).json(user);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
