const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
const { connectDB } = require("./config/database");

const { UserModel } = require("./models/user");
const e = require("express");

// This is the middleware to convert the all requests into json format.
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // find whether the user is present or not
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      throw new Error("user not found");
    }

    // compare the password
    const isMatch = await user.verifyPassword(password);

    if (isMatch) {
      const jwtToken = await user.getJWT(); // jwt token generation
      res.cookie("token", jwtToken); // setting the cookie with jwt token
      res.send("Loggedin successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

// to get user by id 0r email or age whatever
app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " " + "is logged in!!");
  // res.send("reading cookies");
});

// to make connection request to other user
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("connection request sent successfully");
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

connectDB().then(() => {
  console.log("DB connected successfully");
  app.listen(3000, () => {
    console.log("app is listening @3000");
  });
});
