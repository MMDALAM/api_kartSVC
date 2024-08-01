const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = Schema(
  {
    nameService: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = { serviceModel: mongoose.model("service", serviceSchema) };
