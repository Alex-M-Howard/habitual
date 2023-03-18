const User = require("../../../models/user");

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      let result = await User.findAll();
      return res.status(200).json(result);

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
