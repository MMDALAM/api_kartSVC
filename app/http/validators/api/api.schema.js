const Joi = require("@hapi/joi");
const persianjs = require("persianjs");

const oilChangerSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    workName: Joi.string().min(2).max(30).required().messages({
      "string.empty": " لطفا نام خود را کامل وارد کنید ",
      "string.min": " لطفا نام خود را کامل وارد کنید ",
      "string.max": " لطفا نام خود را کامل وارد کنید ",
    }),
    workPhone: Joi.string().lowercase().length(11).required().messages({
      "string.empty": "تلفن را با 0 و صحیح وارد کنید ",
      "string.length": "تلفن را با 0 و صحیح وارد کنید ",
    }),
    workAddress: Joi.string().min(1).max(350).required().messages({
      "string.empty": " آدرس نمیتواند بیشتر از 350 حروف باشد",
      "string.min": " آدرس نمیتواند بیشتر از 350 حروف باشد",
      "string.max": " آدرس نمیتواند بیشتر از 350 حروف باشد",
    }),
  });

const plateSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    plate: Joi.string()
      .min(4)
      .message(" پلاک را بطور صحیح وارد کنید ")
      .max(25)
      .message(" پلاک را بطور صحیح وارد کنید ")
      .required(),
    typePlate: Joi.allow(),
  });

const servicesSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    oilName: Joi.string().max(2).max(50).allow().required().messages({
      "string.empty": "نام روغن را وارد کنید",
      "string.length": "نام روغن را وارد کنید",
    }),
    services: Joi.array().allow(),
    phone: Joi.allow(),
    plate: Joi.string().allow(""),
    kmNext: Joi.number().min(1000).max(10000).required().messages({
      "number.empty": "میزان کارکرد را وارد کنید",
      "number.min": "میزان کارکرد باید حداقل 1000 باشد",
      "number.max": "میزان کارکرد نمی‌تواند بیشتر از 1000000 باشد",
      "any.required": "ورود میزان کارکرد الزامی است",
      "number.base": "لطفا از کیبورد انگلسی استفاده کنید",
    }),
    kmNow: Joi.string()
      .required()
      .custom((value, help) => {
        let num = persianjs(value).persianNumber().toString();
        if (num < 1 || num > 999999) return help.error("string.custom");
      })
      .messages({
        "string.empty": "میزان کارکرد را وارد کنید",
        "string.custom":
          "میزان کارکرد نمیتواند بیشتر از 999999 یا کمتر از 1 باشد",
      }),
    description: Joi.allow(),
    car: Joi.allow(),
  });

const oilChangerImageSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    typeImage: Joi.allow(),

    filename: Joi.string()
      .allow()
      .pattern(/(\.png|\.jpg|\.jpeg|\.webp|\.gif)$/)
      .message("تصویر ارسال شده صحیح نیست"),
    fileUploadPath: Joi.allow(),
  });

module.exports = {
  oilChangerSchema,
  plateSchema,
  servicesSchema,
  oilChangerImageSchema,
};
