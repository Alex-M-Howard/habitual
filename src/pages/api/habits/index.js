export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get all habits" });

    case "POST":
      return res.status(200).json({ message: "Add habit" });

    case "PUT":
      return res.status(200).json({ message: "Update habit" });

    case "DELETE":
      return res.status(200).json({ message: "Delete habit" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
