import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import Journals from "@/models/journals";

const jsonschema = require("jsonschema");
const journalNewSchema = require("@/models/schemas/journalNew.json");

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
      response = await Journals.getJournals({ userId: req.query.userId });
      return res.status(200).json(response);

    case "POST":
      validator = jsonschema.validate(req.body, journalNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((error) => error.stack);
        return res.status(400).json({ errors: errs });
      }

      req.body.userId = req.query.userId;
      response = await Journals.add(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "PUT":
      req.body.userId = req.query.userId;
      response = await Journals.update(req.body);

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);

    case "DELETE":
      response = await Journals.remove(req.body);
      return res.status(200).json(response);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
