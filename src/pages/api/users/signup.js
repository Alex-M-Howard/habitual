export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return res.status(200).json({ message: "SIGNUP USER" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
