const express = require("express");

const app = express();
const { connectDB } = require("./config/database");

const { UserModel } = require("./models/user");

// This is the middleware to convert the all requests into json format.
app.use(express.json());

app.post("/user", async (req, res) => {
  //creating the instant of new users
  console.log(req.body);
  const newUser = new UserModel(req.body);

  try {
    await newUser.save();
    res.send("user saved successfully");
  } catch (err) {
    res.send("Error" + err.message);
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
app.get("/user", async (req, res) => {
  try {
    const user = await UserModel.findOne({ emailId: "prasath@gmail.com" });
    res.send(user);
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
