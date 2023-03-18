export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ message: "Get journal by ID" });
    
    case "PUT":
      return res.status(200).json({ message: "Update journal by ID" });
    
    case "DELETE":
      return res.status(200).json({ message: "Delete journal by ID" });
  
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
