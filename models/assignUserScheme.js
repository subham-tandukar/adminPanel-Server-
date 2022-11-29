const mongoose = require("mongoose");

const assignUserSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const assignUsers = new mongoose.model("assignUsers", assignUserSchema);

module.exports = assignUsers;
