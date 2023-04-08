import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import User from "@/models/user";

const jsonschema = require("jsonschema");
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
      response = await User.getUserLog(parseInt(req.query.userId));

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "POST":
      validator = jsonschema.validate(req.body, trackerPostSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      req.body.userId = parseInt(req.query.userId);
      response = await User.logUserHabit(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "DELETE":
      // TODO - Add validation
      req.body.userId = parseInt(req.query.userId);
    response = await User.removeLoggedUserHabit(req.body);
    return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
