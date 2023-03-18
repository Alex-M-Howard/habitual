const User = require("../../models/user");
const jsonschema = require("jsonschema");
const userNewSchema = require("../../models/schemas/userNew.json");
const { createToken } = require("../../helpers/tokens");

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
          const errs = validator.errors.map(error => error.stack);
          return res.status(400).json({errors: errs})
        }

        const user = await User.register(req.body);
        const token = createToken(user);
        return res.status(201).json({ user, token });
      } catch (error) {
          return res.status(400).json({ errors: error });
      }


    default:
      return res.status(405).json({ ERROR: "Not allowed" });
  }
}
