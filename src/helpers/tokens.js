const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/db");

/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dateJoined: user.dateJoined,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
