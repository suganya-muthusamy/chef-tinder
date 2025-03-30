const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // 1. get and verify the cookie
    const cookies = req.cookies;
    if (!cookies.token) {
      return res.status(401).send("Login First!");
    }

    // decoding/ verify the jwt token;
    var decoded = jwt.verify(cookies.token, "CHEF@tinder?build");

    // 2. get the user details
    const { _id } = decoded;
    const user = await UserModel.findById(_id);
    req.user = user;
    if (!user) {
      throw new Error("User not found");
    }

    // 3. pass the user details to the next middleware
    next();
  } catch (err) {
    res.send("Error: " + err.message);
  }
};

module.exports = { userAuth };
