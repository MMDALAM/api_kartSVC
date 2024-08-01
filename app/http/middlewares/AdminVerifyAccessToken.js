const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constans");
const { userModel } = require("../../models/users");
const { comparePassword, userAgent } = require("../../utils/functions");

function AdminVerifyAccessToken(req, res, next) {
  const token = req.cookies.tokenKartSVD;
  JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
    if (err) return next(createError.Unauthorized("ورود انجام نشده است"));
    const { userID, agent } = payload || {};
    const user = await userModel.findById(userID);
    if (!user) return next(createError.Unauthorized(" حساب کاربری یافت نشد "));
    if (!comparePassword(userAgent(req), agent))
      return next(createError.Unauthorized("توکن یافت نشد"));
    req.user = user;
    return next();
  });
}

function checkRole(role) {
  return function (req, res, next) {
    try {
      const user = req.user;
      if (user.roles.includes(role)) return next();
      throw createError.Forbidden("شما به این آدرس دسترسی ندارید");
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  AdminVerifyAccessToken,
  checkRole,
};
