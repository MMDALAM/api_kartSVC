const serviceController = require("../../../../http/controllers/admin/serviceController");
const {
  VerifyAccessToken,
} = require("../../../../http/middlewares/VerifyAccessToken");

const router = require("express").Router();

router.post("/service", VerifyAccessToken, serviceController.addService);
router.delete("/service", VerifyAccessToken, serviceController.deleteService);

module.exports = { adminRouter: router };
