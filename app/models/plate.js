const mongoose = require("mongoose");
const { datePersian } = require("../utils/functions");
const Schema = mongoose.Schema;

const plateSchema = Schema(
  {
    typePlate: { type: Number, default: 0 },
    plate: { type: String, required: true },
    ownerNumber: { type: String, lowercase: true, required: true },
  },
  { timestamps: true }
);

module.exports = {
  plateModel: mongoose.model("plate", plateSchema),
};
