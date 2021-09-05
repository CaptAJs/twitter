const jwt = require("jsonwebtoken");
const credentials = require("../config/credentials");
const Profile = require("../models/Profile");

module.exports = function (req, res, next) {
  // Check if not token
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ success: false, errorMessage: "No token, authorization denied" });
  }
  const token = req.headers.authorization.split(" ")[1];

  // Verify token
  try {
    jwt.verify(token, credentials.jwtSecret, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ success: false, errorMessage: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errorMessage: "Something went wrong..." });
  }
};
