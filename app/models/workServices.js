const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment-jalaali");

const workServicesSchema = Schema(
  {
    oilChanger: {
      type: Schema.Types.ObjectId,
      ref: "oilChanger",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    services: {
      type: [Schema.Types.ObjectId],
      ref: "service",
      required: true,
    },
    plate: { type: String, required: true },
    slug: { type: String, required: true },
    typeUser: { type: String, required: true },
    oilName: { type: String, required: true },
    car: { type: String },
    phone: { type: String, required: true },
    kmNow: { type: String, required: true },
    kmNext: { type: String, required: true },
    nextTimeOilChang: { type: Date },
    description: { type: String },
    createdAt: {
      type: Date,
      get: (createdAt) => moment(createdAt).format("jYYYY/jMM/jDD,HH:mm"),
    },
  },
  { timestamps: true, toObject: { getters: true }, toJSON: { getters: true } }
);

workServicesSchema.plugin(mongoosePaginate);

module.exports = {
  workServicesModel: mongoose.model("WorkServices", workServicesSchema),
};
