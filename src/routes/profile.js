const express = require("express");
const profileRouter = express.Router();
const { UserModel } = require("../models/user");
const { userAuth } = require("../middlewares/auth");

// to get user by id 0r email or age whatever
profileRouter.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " " + "is logged in!!");
  // res.send(user);
});

module.exports = { profileRouter };
