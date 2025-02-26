const { DB_URI } = require("../utils/constant");
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(DB_URI);
};

module.exports = { connectDB };
