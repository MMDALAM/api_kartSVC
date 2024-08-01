const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = Schema(
  {
    firstName: { type: String, lowercase: true, default: "" },
    lastName: { type: String, lowercase: true, default: "" },
    phone: { type: String, lowercase: true, required: true },
    email: { type: String },
    gender: { type: String, default: "" },
    birthDay: { type: Date },
    password: { type: String, default: "" },
    otp: {
      type: Object,
      default: {
        code: 0,
        expiresIn: 0,
      },
    },
    roles: { type: [String], default: ["USER"] },
    oilChanger: {
      type: mongoose.Types.ObjectId,
      ref: "oilChanger",
      default: null,
    },
    plate: {
      type: [mongoose.Types.ObjectId],
      ref: "plate",
    },
    isOilChanger: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);

module.exports = { userModel: mongoose.model("user", userSchema) };
