const express = require("express");
const profileRouter = express.Router();
const { UserModel } = require("../models/user");
const { userAuth } = require("../middlewares/auth");

// to get user by id 0r email or age whatever
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ data: user, message: "User fetched successfully" });
    // res.send(user);
  } catch (error) {
    res.status(500).send({ message: "user not found", error: error.message });
  }
});

// to edit the user profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const loggedInUser = req.user;

  const updates = req.body;

  console.log("loggedInUser", loggedInUser);
  console.log("updates", updates);
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "about",
    "gender",
    "photoUrl",
    "skills",
  ];
  const isValidOperation = Object.keys(updates).every((key) =>
    allowedUpdates.includes(key)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    Object.keys(updates).forEach((key) => {
      loggedInUser[key] = updates[key];
    });

    await loggedInUser.save();
    res.json({ message: "User updated successfully!", data: loggedInUser });
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = { profileRouter };
