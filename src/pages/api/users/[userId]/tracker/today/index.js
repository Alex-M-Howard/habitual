import { authenticateJWT, ensureLoggedIn } from "@/middleware/auth";
import User from "@/models/user";

const jsonschema = require("jsonschema");


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
      response = await User.getUserLogToday(parseInt(req.query.userId));

      if (response.error) return res.status(400).json(response);
      return res.status(200).json(response);


    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
