export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return res.status(200).json({message: "adding user to Pixela"});
        
    case "PUT":
      return res.status(200).json({message: "Updating pixela user"});

    case "DELETE":
      return res.status(200).json({message: "Delete pixela user"});

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
