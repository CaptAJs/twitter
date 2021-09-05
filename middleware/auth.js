const jwt = require("jsonwebtoken");
const config = require("config");
const Profile = require("../models/Profile");

module.exports = function (req, res, next) {
  // Check if not token
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }
  const token = req.headers.authorization.split(" ")[1];

  // Verify token
  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong...", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
