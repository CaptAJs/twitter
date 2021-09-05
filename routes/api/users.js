const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const User = require("../../models/User");

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(200).json({ success: false, errorMessage: errors });
  }
  User.findOne({ email: req.body.email.toLowerCase() }).then((user) => {
    if (user)
      return res
        .status(200)
        .json({ success: false, errorMessage: "User already exist" });
    else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        mobile: req.body.mobile,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.json({ success: true, msg: "Successfully registered" })
            )
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(200).json({ success: false, errorMessage: errors });
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      const error = "User not found";
      return res.status(400).json({ success: false, errorMessage: error });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };

        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            return res.status(200).json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(200)
          .json({ success: false, errorMessage: "Incorrect password" });
      }
    });
  });
});

//@route GET api/users/current

router.get("/current", auth, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});
module.exports = router;
