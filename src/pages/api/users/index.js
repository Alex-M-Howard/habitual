const User = require("../../../models/user");

export default async function handler(req, res) {
  let result = await User.findAll();
  return res.status(200).json(result);
}
