const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");

// Signup API
authRouter.post("/signup", async (req, res) => {
  //creating the instant of new users
  try {
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
    });

    await newUser.save();
    res.send("user saved successfully");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // find whether the user is present or not
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      throw new Error("user not found");
    }

    // compare the password
    const isMatch = await user.verifyPassword(password); // this logic written in user.js

    if (isMatch) {
      const jwtToken = await user.getJWT(); // jwt token generation  // this logic written in user.js

      res.cookie("token", jwtToken); // setting the cookie with jwt token
      res.send("Loggedin successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

module.exports = { authRouter };
