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
  let token = req.rawHeaders[req.rawHeaders.indexOf('Authorization') + 1]
  return token;
}


/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUser(user, req) {
  const username = req.query.username;
  if (username !== user.email.slice(0, user.email.indexOf('@'))) {
    return false;
  }

  return username;
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
