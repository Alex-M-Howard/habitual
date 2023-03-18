export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get list of user habits" });

    case "POST":
      return res.status(201).json({ message: "Create new habit" });

    case "PUT":
      return res.status(200).json({ message: "Update habit" });

    case "DELETE":
      return res.status(200).json({ message: "Delete user habit" });

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
