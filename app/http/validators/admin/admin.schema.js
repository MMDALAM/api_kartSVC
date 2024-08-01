const Joi = require("@hapi/joi");

const serviceSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    nameService: Joi.string()
      .min(1)
      .message(" نام خدمات را وارد کنید ")
      .max(25)
      .message(" نام خدمات را وارد کنید ")
      .required(),
  });

module.exports = {
  serviceSchema,
};
