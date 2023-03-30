import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import User from "@/models/user";

const jsonschema = require("jsonschema");
const userHabitGetSchema = require("@/models/schemas/user_habitsGet.json");
const userHabitNewSchema = require("@/models/schemas/user_habitsNew.json");
const userHabitDeleteSchema = require("@/models/schemas/user_habitsDelete.json");

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
      validator = jsonschema.validate(req.body, userHabitGetSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await User.getUserHabits(req.body.userId);
      return res.status(200).json(response);

    case "POST":
      validator = jsonschema.validate(req.body, userHabitNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await User.addUserHabit(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "DELETE":
      validator = jsonschema.validate(req.body, userHabitDeleteSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await User.removeUserHabit(req.body);
      return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
