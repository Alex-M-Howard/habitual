import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import Categories from "@/models/categories";
const jsonschema = require("jsonschema");
const categoriesNewSchema = require("@/models/schemas/categoriesNew.json");
const categoriesDeleteSchema = require("@/models/schemas/categoriesDelete.json");

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
      response = await Categories.findAll();
      return res.status(200).json(response);

    
    
    case "POST":
      validator = jsonschema.validate(req.body, categoriesNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await Categories.add(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    
    
    case "DELETE":
      validator = jsonschema.validate(req.body, categoriesDeleteSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      response = await Categories.remove(req.body);
      return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
