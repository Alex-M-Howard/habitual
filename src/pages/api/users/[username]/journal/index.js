export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get list of avaialble journals" });
    
    case "POST":
      return res.status(201).json({ message: "Create new journal" });
    
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
