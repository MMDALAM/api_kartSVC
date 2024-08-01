const plateController = require("../../../../http/controllers/api/plateController");
const userController = require("../../../../http/controllers/user/userController");
const {
  VerifyAccessToken,
} = require("../../../../http/middlewares/VerifyAccessToken");

const router = require("express").Router();

router.get("/",  VerifyAccessToken, userController.userData);
router.post("/", VerifyAccessToken, userController.editUser);
router.delete("/plate", VerifyAccessToken, plateController.deletePlate);

module.exports = {
  userRouter: router,
};
