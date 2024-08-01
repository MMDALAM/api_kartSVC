const controller = require("../controller");
const createError = require("http-errors");
const { userModel } = require("../../../models/users");
const { sendData } = require("../../../utils/functions");
const { userSchema } = require("../../validators/user/user.schema");

module.exports = new (class userAuthController extends controller {
  async userData(req, res, next) {
    try {
      const users = req.user;

      if (!users?.password)
        return next(createError.Unauthorized("ورود انجام نشده است"));

      if (!users)
        throw createError.Unauthorized("ورود انجام نشد مجدد تلاش کنید");

      return sendData(req, res, 200);
    } catch (err) {
      next(createError.BadRequest(err.message));
    }
  }

  async editUser(req, res, next) {
    try {
      await userSchema.validateAsync(req.body);
      await userModel.findByIdAndUpdate(req.user.id, { $set: { ...req.body } });

      return sendData(req, res, 200, {
        message: " ویرایش با موفقیت انجام شد ",
      });
    } catch (err) {
      next(err)
    }
  }
})();
