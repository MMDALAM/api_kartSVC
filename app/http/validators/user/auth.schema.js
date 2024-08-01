const Joi = require("@hapi/joi");

const getOtpSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    phone: Joi.string()
      .lowercase()
      .length(11)
      .pattern(/^09[0-9]{9}$/)
      .message(" شماره موبایل را با 0 و صحیح وارد کنید ")
      .required()
      .messages({
        "string.empty": " شماره موبایل را با 0 و صحیح وارد کنید ",
        "string.min": " شماره موبایل را با 0 و صحیح وارد کنید ",
        "string.max": " شماره موبایل را با 0 و صحیح وارد کنید ",
      }),
    loginMethod: Joi.number().allow().min(1).max(2).required().messages({
      "number.empty": "نوع ورود را وارد کن",
      "number.min": "نوع ورود را وارد کن",
      "number.max": "نوع ورود را وارد کن",
      "any.required": "نوع ورود را وارد کن",
      "number.base": "لطفا از کیبورد انگلسی استفاده کنید",
    }),
  });

const loginSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    phone: Joi.string()
      .lowercase()
      .pattern(/^09[0-9]{9}$/)
      .message(" شماره موبایل را با 0 و صحیح وارد کنید ")
      .required()
      .messages({
        "string.empty": " شماره موبایل را با 0 و صحیح وارد کنید ",
      }),
    loginMethod: Joi.number().allow().min(1).max(2).required().messages({
      "number.empty": "نوع ورود را وارد کن",
      "number.min": "نوع ورود را وارد کن",
      "number.max": "نوع ورود را وارد کن",
      "any.required": "نوع ورود را وارد کن",
      "number.base": "نوع ورود را وارد کن",
    }),
    password: Joi.allow(),
    firstName: Joi.allow(),
    lastName: Joi.allow(),
  });

const otpSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    phone: Joi.string()
      .lowercase()
      .pattern(/^09[0-9]{9}$/)
      .message(" شماره موبایل را با 0 و صحیح وارد کنید ")
      .required()
      .messages({
        "string.empty": " شماره موبایل را با 0 و صحیح وارد کنید ",
        "any.required": "ورود میزان کارکرد الزامی است",
      }),
    loginMethod: Joi.number().allow().min(1).max(2).required().messages({
      "number.empty": "نوع ورود را وارد کن",
      "number.min": "نوع ورود را وارد کن",
      "number.max": "نوع ورود را وارد کن",
      "any.required": "ورود میزان کارکرد الزامی است",
      "number.base": "مقدار باید یک عدد باشد",
    }),
    password: Joi.number().min(10000).max(99999).required().messages({
      "number.empty": " کد صحیح وارد نشده است",
      "number.min": " کد صحیح وارد نشده است",
      "number.max": " کد صحیح وارد نشده است",
      "any.required": "ورود میزان کارکرد الزامی است",
      "number.base": "لطفا از کیبورد انگلسی استفاده کنید",
    }),
    firstName: Joi.allow(),
    lastName: Joi.allow(),
  });

const passSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    phone: Joi.string()
      .lowercase()
      .pattern(/^09[0-9]{9}$/)
      .message(" شماره موبایل را با 0 و صحیح وارد کنید ")
      .required()
      .messages({
        "string.empty": " شماره موبایل را با 0 و صحیح وارد کنید ",
        "any.required": "ورود میزان کارکرد الزامی است",
      }),
    loginMethod: Joi.number().allow().min(1).max(2).required().messages({
      "number.empty": "نوع ورود را وارد کن",
      "number.min": "نوع ورود را وارد کن",
      "number.max": "نوع ورود را وارد کن",
      "any.required": "نوع ورود را وارد کن",
      "number.base": "لطفا از کیبورد انگلسی استفاده کنید",
    }),
    password: Joi.string().min(7).max(20).required().messages({
      "string.min": "رمز عبور نمیتواند کمتر از 8 کاراکتر باشد",
      "string.max": "رمز عبور نمیتواند بیشتر از 20 کاراکتر باشد",
      "string.empty": "رمزعبور صحیح وارد نشده است",
    }),
    firstName: Joi.allow(),
    lastName: Joi.allow(),
  });

module.exports = {
  getOtpSchema,
  otpSchema,
  passSchema,
  loginSchema,
};
