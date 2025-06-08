const mongoose = require("mongoose");
const validator = require("validator"); // to validate email and password strength etc
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    default: "Anonymous",
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is not strong enough");
      }
    },
  },
  age: {
    type: Number,
  },

  gender: {
    type: String,
    enum: {
      values: ["Male", "Female", "Others"],
      message: "{VALUE} is invalid gender data",
    },
    // validate(value) {
    //   if (!["male", "female", "other"].includes(value.toLowerCase())) {
    //     throw new Error("Invalid gender data");
    //   }
    // },
  },
  photoUrl: {
    type: String,
    default:
      "https://tse4.mm.bing.net/th?id=OIP.WpnGIPj1DKAGo-CP64znTwHaHa&pid=Api&P=0&h=180",
  },
  skills: {
    type: [String],
    validate(value) {
      if (value.length > 20) {
        throw new Error("Skills should be maximum of 20");
      }
    },
  },
  about: {
    type: String,
    default: "Hi there! I am using Chef Tinder!!",
  },
});

// verify password
// we cannot use arrow function here, "this" keyword will not work with arrow function
userSchema.methods.verifyPassword = async function (passwordEnteredByUser) {
  const user = this;
  const hashedPassword = user.password;
  const isVerified = await bcrypt.compare(
    passwordEnteredByUser,
    hashedPassword
  );
  return isVerified;
};

// generate jwt token
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d", //
  });
  return token;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
