const mongoose = require("mongoose");
const validator = require("validator");

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
    required: true,
  },

  gender: {
    type: String,
    required: true,
    validate(value) {
      if (!["male", "female", "other"].includes(value.toLowerCase())) {
        throw new Error("Invalid gender data");
      }
    },
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
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
