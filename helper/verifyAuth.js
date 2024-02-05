/* eslint-disable max-len */
const jwt = require("jsonwebtoken");

// import env from '../../env';

/**
 * Verify Token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response object
 */

function verifyToken(req, res, next) {
  const { token } = req.headers;
  if (!token) {
    var responseErr = {
      status: 401,
      message: "Token not provided",
    };
    return res.status(401).send(responseErr);
  }
  try {
    const decoded = jwt.verify(token, "sk_digi");
    if (decoded) {
      console.log(decoded);

      if (decoded.type === "logged") {
        req["user_id"] = decoded.user_id;
        req["email"] = decoded.email;
        req["type"] = decoded.type; // type = 1 user type = 2 vendor
        req["name"] = decoded.name;

        next();
      } else {
        req.user = {
          email: decoded.email,
          user_id: decoded.user_id,
          type: decoded.type,
          name: decoded.name,
        };
        next();
      }
    }
  } catch (error) {
    var responseErr = {
      status: 401,
      message: "Authentication Failed",
    };
    return res.status(401).send(responseErr);
  }
}

module.exports = verifyToken;
