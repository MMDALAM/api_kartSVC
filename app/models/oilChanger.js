const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const oilChangerSchema = Schema(
  {
    name: { type: String, lowercase: true, required: true },
    address: { type: String, lowercase: true, required: true },
    phone: { type: String, required: true },
    license: {
      type: Object,
      default: {
        status: 0,
        message: "",
        image: "",
        url: "",
      },
    },
    idCard: {
      type: Object,
      default: {
        status: 0,
        message: "",
        image: "",
        url: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = {
  oilChangerModel: mongoose.model("oilChanger", oilChangerSchema),
};
