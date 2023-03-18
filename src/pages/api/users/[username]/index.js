import { UnauthorizedError } from "@/helpers/apiError";
import { authenticateJWT } from "@/middleware/auth";

export default async (req, res) => {
  try {
    let token = req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]
    const user = authenticateJWT(token);
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized"})
  }

  switch (req.method) {
    case "GET":      
      return res.status(200).json({ message: "Get user" });

    case "PUT":
      return res.status(200).json({ message: "Update user" });

    case "DELETE":
      return res.status(200).json({ message: "Delete user" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};
