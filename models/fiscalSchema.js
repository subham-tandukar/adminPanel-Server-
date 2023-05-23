const mongoose = require("mongoose");

const fiscalSchema = new mongoose.Schema({
  startYear: {
    type: String,
    required: true,
  },

  endYear: {
    type: String,
    required: true,
  },

  active: {
    type: String,
    default: "N",
  },
});

const fiscal = new mongoose.model("fiscal", fiscalSchema);

module.exports = fiscal;
