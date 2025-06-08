const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const { userAuth } = require("../middlewares/auth");

// Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = await savedUser.getJWT(); // Generate JWT token

    // res.cookie("token", token, { httpOnly: true, secure: true }); // Secure cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.status(200).send({
      message: "User saved successfully",
      data: savedUser,
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // find whether the user is present or not
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      return res.status(400).send("Invalid Credentials!");
    }

    // compare the password
    const isMatch = await user.verifyPassword(password); // this logic written in user.js

    if (isMatch) {
      const token = await user.getJWT(); // jwt token generation  // this logic written in user.js

      // res.cookie("token", jwtToken, { httpOnly: true, secure: true }); // Secure cookie
      res.cookie("token", token, {
        // httpOnly: true,
        expires: new Date(Date.now() + 8 * 3600000),
      });

      // console.log("token", token);
      res.send({
        message: "Login successful",
        data: user,
      });
    } else {
      return res.status(400).send("Invalid Credentials!");
    }
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

// Logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out successfully");
});

module.exports = { authRouter };
