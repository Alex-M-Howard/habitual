export default async function handler(req, res) {
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
}