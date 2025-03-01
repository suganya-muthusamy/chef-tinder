const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
    const isMatch = await bcrypt.compare(password, user.password);

    // jwt token generation
    const jwtToken = jwt.sign({ _id: user._id }, "CHEF@tinder?build");
    console.log(jwtToken);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    } else {
      res.cookie("token", jwtToken); // setting the cookie with jwt token
      res.send("Loggedin successfully");
    }
  } catch (err) {
    res.send("Error : " + err.message);
  }
});

// to get all users from DB
// app.get("/user", async (req, res) => {
//   try {
//     const allusers = await UserModel.find();
//     res.send(allusers);
//   } catch (err) {
//     res.send("Error" + err.message);
//   }
// });

// to get user by id 0r email or age whatever
app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  try {
    // decoding/ verify the jwt token;
    var decoded = jwt.verify(cookies.token, "CHEF@tinder?build");
    console.log(decoded);
    res.send("reading cookies");
  } catch (err) {
    res.send("Error" + err.message);
  }
});

// to update user
app.patch("/user", async (req, res) => {
  try {
    const userUpdate = await UserModel.findByIdAndUpdate(
      "67bf3927af70a0b9d7c801fa",
      {
        emailId: "dharsan56@gmail.com",
        firstName: "Dharsan",
        lastName: "Natraj",
        skills: ["Drawing", "playing"],
      },
      { runValidators: true }
    );
    res.send(userUpdate);
  } catch (err) {
    res.send("Error" + err.message);
  }
});

// to delete user
app.delete("/user", async (req, res) => {
  console.log(req.body);
  const userId = req.body._id;
  try {
    const userDelete = await UserModel.findByIdAndDelete(userId);
    res.send(userDelete);
  } catch (err) {
    res.send("Error" + err.message);
  }
});
connectDB().then(() => {
  console.log("DB connected successfully");
  app.listen(3000, () => {
    console.log("app is listening @3000");
  });
});
