const express = require("express");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userConnections } = require("./routes/user");

const app = express();
const { connectDB } = require("./config/database");

// This is the middleware to convert the all requests into json format.
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userConnections);

connectDB().then(() => {
  console.log("DB connected successfully");
  app.listen(3000, () => {
    console.log("app is listening @3000");
  });
});
