const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // 1. get and verify the cookie
    const cookies = req.cookies;
    if (!cookies.token) {
      throw new Error("Please login first");
    }

    // decoding/ verify the jwt token;
    var decoded = jwt.verify(cookies.token, "CHEF@tinder?build");
    if (!decoded) {
      throw new Error("Please login first");
    }

    // 2. get the user details
    const { _id } = decoded;
    const user = await UserModel.findById(_id);
    req.user = user;

    // 3. pass the user details to the next middleware
    next();
  } catch (err) {
    res.send("Error: " + err.message);
  }
};

module.exports = { userAuth };
