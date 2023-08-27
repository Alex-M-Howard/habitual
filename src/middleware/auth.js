/*
  * Middleware for handling authentication and authorization.
    - authenticateJWT: Used to authenticate a user based on a JWT.
    - ensureLoggedIn: Used to ensure a user is logged in.
    - ensureCorrectUser: Used to ensure a user is logged in and is the correct user.
*/

"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(token) {
  token = token.replace(/^[Bb]earer /, "").trim();
  const user = jwt.verify(token, process.env.NEXTAUTH_SECRET);
  return user;
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req) {
  let token;

  for (let i = 0; i < req.rawHeaders.length - 1; i++) {
    if (req.rawHeaders[i].toLowerCase() === "authorization") {
      token = req.rawHeaders[i + 1];
      break;
    }
  }

  return token;
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUser(user, req) {
  const userId = parseInt(req.query.userId);
  if (userId !== user.id) {
    return false;
  }

  return user;
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
