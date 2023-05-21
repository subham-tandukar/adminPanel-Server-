const mongoose = require("mongoose");

const roleNameSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "1",
  },
});

const RoleName = new mongoose.model("rolename", roleNameSchema);

module.exports = RoleName;
