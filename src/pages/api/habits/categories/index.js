export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get categories" });

    case "POST":
      return res.status(200).json({ message: "Add category" });

    case "PUT":
      return res.status(200).json({ message: "Update category" });

    case "DELETE":
      return res.status(200).json({ message: "Delete category" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
