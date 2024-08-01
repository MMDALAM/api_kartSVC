const { userModel } = require("../../../../models/users");
const { USER_ROLE } = require("../../../../utils/constans");
const {
  RandomNumber,
  SignAccessToken,
  hashString,
  comparePassword,
  sendCode,
} = require("../../../../utils/functions");
const {
  getOtpSchema,
  loginSchema,
  otpSchema,
  passSchema,
} = require("../../../validators/user/auth.schema");
const controller = require("../../controller");
const createError = require("http-errors");

module.exports = new (class userAuthController extends controller {
  async getOtp(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body);
      const { phone } = req.body;
      const code = RandomNumber();
      const user = await userModel.findOne({ phone });

      const checkExistUser = await this.checkExistUser(phone);
      if (checkExistUser)
        return await this.checkTypeLogin(req, res, next, code, phone);
      else {
        await this.register(phone, code);
        await sendCode(phone, code + "");
      }

      const expires = new Date().getTime() + 120000;
      return res.status(200).json({
        data: {
          expire: expires,
          newUser: user?.password ? 0 : 1,
          message: " کد اعتبار سنجی با موفقیت برای شما ارسال شد ",
          phone,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async checkTypeLogin(req, res, next, code) {
    try {
      const { phone } = req.body;
      const user = await userModel.findOne({ phone });
      const newU = user?.password ? 0 : 1;

      if (newU == 1 || req.body.loginMethod == 2) {
        let otp = {
          code,
          expiresIn: new Date().getTime() + 120000,
        };
        const now = Date.now();
        const expires = otp?.expiresIn;

        if (+user.otp.expiresIn >= now)
          return res.json({
            data: {
              newUser: user?.password ? 0 : 1,
              expire: expires,
              message: " کد ارسال شده ",
            },
          });

        const result = await this.checkExistUser(phone);
        if (result) await this.updateUser(phone, { otp });
        else throw createError.Unauthorized("ورود انجام نشد مجدد تلاش کنید");

        await sendCode(phone, code + "");

        return res.status(200).json({
          statusCode: 200,
          data: {
            expire: expires,
            newUser: user?.password ? 0 : 1,
            message: " کد اعتبار سنجی با موفقیت برای شما ارسال شد ",
          },
        });
      }

      return res.status(200).json({
        statusCode: 200,
        data: {
          newUser: user?.password ? 0 : 1,
          message: "ورود با رمز عبور",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      await loginSchema.validateAsync(req.body);
      const loginMethod = parseInt(req.body.loginMethod);

      if (!loginMethod)
        throw createError.Unauthorized("نوع ورود وارد نشده است");

      if (loginMethod === 1) return this.checkPass(req, res, next);
      else if (loginMethod === 2) return this.checkOtp(req, res, next);
      else throw createError.BadRequest("نوع ورود صحیح وارد نشده");
    } catch (err) {
      next(err);
    }
  }

  async checkOtp(req, res, next) {
    try {
      await otpSchema.validateAsync(req.body);

      const { phone, password } = req.body;
      const code = parseInt(password);
      const user = await userModel.findOne({ phone });
      const users = await userModel
        .findOne(
          { phone },
          { otp: 0, password: 0, workServices: 0, updatedAt: 0, __v: 0 }
        )
        .populate("oilChanger", "name address phone ")
        .populate("plate", "typePlate plate ")
        .exec();

      if (!user) throw createError.NotFound("کاربر یافت نشد ");

      const now = Date.now();

      if (+user.otp.expiresIn < now)
        return res.status(400).json({
          errors: { password: " کد وارد شده منقضی شده" },
        });

      if (user.otp.code != code)
        return res.status(400).json({
          errors: { password: "کد ارسال شده صحیح نمیباشد" },
        });

      const accessToken = await SignAccessToken(req, user._id);

      return res.json({
        accessToken,
        data: {
          user: users,
          newUser: user?.password ? 0 : 1,
          message: "توکن ساخت شد",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async checkPass(req, res, next) {
    try {
      await passSchema.validateAsync(req.body);
      const pass = req?.body?.password?.length;
      if (7 >= pass || 20 <= pass)
        return res.status(400).json({
          errors: { password: "رمز عبور را کامل وارد کنید" },
        });
      const { phone, password, firstName, lastName } = req.body;
      const user = await userModel.findOne({ phone });
      const users = await userModel
        .findOne(
          { phone },
          { otp: 0, password: 0, workServices: 0, updatedAt: 0, __v: 0 }
        )
        .populate("oilChanger", "name address phone ")
        .populate("plate", "typePlate plate ")
        .exec();

      if (firstName || lastName) {
        user.firstName = firstName ? firstName : "";
        user.lastName = lastName ? lastName : "";
        await user.save();
      }

      if (!user.password) {
        const pass = hashString(password);
        user.password = pass;
        await user.save();
      }

      if (!user) throw createError.NotFound("کاربر یافت نشد ");
      if (!comparePassword(password, user.password))
        return res.status(400).json({
          errors: { password: "رمز عبور وارد شده صحیح نمیباشد" },
        });
      const accessToken = await SignAccessToken(req, user._id);
      return res.status(200).json({
        accessToken,
        data: {
          user: users,
          newUser: user?.password ? 0 : 1,
          message: " رمز عبور دخیره , توکن ساخت شد ",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async register(phone, code) {
    let otp = {
      code,
      expiresIn: new Date().getTime() + 120000,
    };
    return !!(await userModel.create({
      phone,
      otp,
      Roles: [USER_ROLE],
    }));
  }

  async checkExistUser(phone) {
    const user = await userModel.findOne({ phone });
    return !!user;
  }

  async updateUser(phone, objectData = {}) {
    Object.keys(objectData).forEach((key) => {
      if (["", " ", 0, null, undefined, "0", NaN].includes(objectData[key]))
        delete objectData[kay];
    });
    const updateResult = await userModel.updateOne(
      { phone },
      { $set: objectData }
    );
    return !!updateResult.modifiedCount;
  }
})();
