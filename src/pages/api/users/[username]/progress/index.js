export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get user's progress" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
