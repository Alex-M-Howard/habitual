import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import HabitCategories from "@/models/habit_categories";
const jsonschema = require("jsonschema");
const habit_categoriesNewSchema = require("@/models/schemas/habit_categoriesNew.json");
const habit_categoriesDeleteSchema = require("@/models/schemas/habit_categoriesDelete.json");

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
      response = await HabitCategories.findAll();
      return res.status(200).json(response);

    
    
    case "POST":
      validator = jsonschema.validate(req.body, habit_categoriesNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await HabitCategories.add(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    
    
    case "DELETE":
      validator = jsonschema.validate(req.body, habit_categoriesDeleteSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await HabitCategories.remove(req.body);
      return res.status(200).json(response);

    
    
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
