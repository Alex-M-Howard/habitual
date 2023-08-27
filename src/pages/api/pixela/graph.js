export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get graph SVG and definitions" });

    case "POST":
      return res.status(200).json({ message: "Create new pixela graph" });

    case "PUT":
      return res.status(200).json({ message: "Updating pixela graph" });

    case "DELETE":
      return res.status(200).json({ message: "Delete pixela graph" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
