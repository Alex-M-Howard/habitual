const pool = require("@/config/db.js");

export default function handler(req, res) {
  res.status(200).json({ message: "User DELETED" });
}
