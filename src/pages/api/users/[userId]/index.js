import {
  authenticateJWT,
  ensureCorrectUser,
  ensureLoggedIn,
} from "@/middleware/auth";
import User from "@/models/user";

const jsonschema = require("jsonschema");
const userUpdateSchema = require("@/models/schemas/userUpdate.json");

export default async (req, res) => {
  let token, user, username, response;

  // Middleware Checks
  try {
    token = ensureLoggedIn(req);
    user = authenticateJWT(token);
    username = ensureCorrectUser(user, req);

    if (!username) throw new Error();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Request Method Switch
  switch (req.method) {
    case "GET":
      response = await User.get(user.email);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "PUT":
      const validator = jsonschema.validate(req.body, userUpdateSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await User.update(user.email, req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "DELETE":
      response = await User.remove(user.email);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};
