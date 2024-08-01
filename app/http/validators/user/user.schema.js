const Joi = require("@hapi/joi");

const userSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    firstName: Joi.string()
      .required()
      .max(30)
      .messages({
        "string.empty": " نام شما نمیتواند خالی بماند ",
        "string.min": " نام شما نمیتواند خالی بماند ",
        "string.max": " نام شما نمیتواند بیشتر از 30 کاکتر باشد  ",
      }),
      lastName:Joi.string()
      .required()
      .max(35)
      .messages({
        "string.empty": " فامیلی شما نمیتواند خالی بماند ",
        "string.min": " فامیلی شما نمیتواند خالی بماند ",
        "string.max": " فامیلی شما نمیتواند بیشتر از 35 کاکتر باشد  ",
      }),
  });


module.exports = {
  userSchema,
};
