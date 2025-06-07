const express = require("express");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userConnections } = require("./routes/user");
const cors = require("cors");

const app = express();
const { connectDB } = require("./config/database");

// This is the middleware to convert the all requests into json format.
app.use(
  cors({
    origin: "http://localhost:5173/", // NOT localhost anymore
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userConnections);

connectDB().then(() => {
  console.log("DB connected successfully");
  app.listen(7777, () => {
    console.log("app is listening @7777");
  });
});
