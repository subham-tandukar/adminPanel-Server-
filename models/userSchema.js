const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    // image: {
    //   type: String,
    //   required: true,
    // },
  },
  { timestamps: true }
);

const users = new mongoose.model("user", userSchema);

module.exports = users;
