const homeController = require("../../../../http/controllers/api/homeController");
const oilChangerController = require("../../../../http/controllers/api/oilChangerController");
const reminderController = require("../../../../http/controllers/api/reminderController");
const serviceController = require("../../../../http/controllers/api/serviceController");
const workServiceController = require("../../../../http/controllers/api/workServiceController");
const {
  VerifyAccessToken,
} = require("../../../../http/middlewares/VerifyAccessToken");
const { uploadFile } = require("../../../../utils/multer");

const router = require("express").Router();

//home
router.get("/", VerifyAccessToken, homeController.indexPage);

//reminder
router.get("/reminder", reminderController.reminders);

//service
router.get("/service", VerifyAccessToken, serviceController.allService);

//services
router.get(
  "/services/:plate",
  VerifyAccessToken,
  workServiceController.listWorkServices
);
router.post(
  "/service",
  VerifyAccessToken,
  workServiceController.addWorkServices
);
router.delete(
  "/service/:slug",
  VerifyAccessToken,
  workServiceController.deleteService
);

//oilChanger
router.post(
  "/oilChanger/upload",
  uploadFile.single("image"),
  VerifyAccessToken,
  oilChangerController.imageOilChanger
);

router.post(
  "/oilChanger",
  VerifyAccessToken,
  oilChangerController.addOilChanger
);

module.exports = { homeRouter: router };
