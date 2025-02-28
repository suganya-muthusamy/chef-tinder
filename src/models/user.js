const mongoose = require("mongoose");

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
      return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
    },
    message: (props) => `${props.value} is not a valid email id!`,
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value);
    },
    message: (props) =>
      `Password should contain at least one uppercase letter, one lowercase letter, one numeric digit, and minimum of 8 characters`,
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
