import {authenticateJWT, ensureLoggedIn} from "@/middleware/auth";
import Habits from "@/models/habits";
const jsonschema = require("jsonschema");
const habitNewSchema = require("../../../models/schemas/habitNew.json");
const habitDeleteSchema = require("../../../models/schemas/habitDelete.json");

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
      response = await Habits.findAll();
      return res.status(200).json(response);

    
    
    case "POST":
      validator = jsonschema.validate(req.body, habitNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await Habits.add(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    
    
    case "DELETE":
      validator = jsonschema.validate(req.body, habitDeleteSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await Habits.remove(req.body);
      return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
