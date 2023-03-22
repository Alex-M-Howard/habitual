import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import User from "@/models/user";
const jsonschema = require("jsonschema");
const trackerGetSchema = require("@/models/schemas/trackerGet.json");
const trackerPostSchema = require("@/models/schemas/trackerPost.json");

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
      validator = jsonschema.validate(req.body, trackerGetSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await User.getUserLog(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    
    
    case "POST":
      validator = jsonschema.validate(req.body, trackerPostSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await User.logUserHabit(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    
    // TODO Add delete to undo a completed habit
    // case "DELETE":
      // validator = jsonschema.validate(req.body, userHabitDeleteSchema);

      // if (!validator.valid) {
      //   const errs = validator.errors.map((error) => error.stack);
      //   return res.status(400).json({ errors: errs });
      // }

      // response = await User.removeUserHabit(req.body);
      // return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
