const authController = require("../../../../http/controllers/user/auth/authController");

const router = require("express").Router();

router.post("/get-otp", authController.getOtp);

router.post("/login", authController.login);

module.exports = {
  userAuthRouter: router,
};
