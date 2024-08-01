const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("../../utils/constans");
const { userModel } = require("../../models/users");
const { comparePassword, userAgent } = require("../../utils/functions");

function getToken(headers) {
  const [bearer, token] = headers?.authorization?.split(" ") || [];
  if (token && ["bearer", "Bearer"].includes(bearer)) return token;
  else return createError.Unauthorized("حساب کاربری شناسایی نشد وارد شوید");
}

function VerifyAccessToken(req, res, next) {
  const token = getToken(req.headers);
  JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
    if (err) return next(createError.Unauthorized("ورود انجام نشده است"));
    const { userID, agent } = payload || {};
    const user = await userModel.findById(userID);
    if (!user) return next(createError.Unauthorized(" حساب کاربری یافت نشد "));
    // if (!comparePassword(userAgent(req), agent))
      // return next(createError.Unauthorized("توکن یافت نشد"));
    req.user = user;
    return next();
  });
}

module.exports = {
  VerifyAccessToken,
};
