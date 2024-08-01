const router = require("express").Router();

const adminController = require("../../http/controllers/admin/adminController");

const {
  AdminVerifyAccessToken,
  checkRole,
} = require("../../http/middlewares/AdminVerifyAccessToken");

router.get("/login", adminController.login);
router.post("/login", adminController.checkLogin);

router.get(
  "/",
  AdminVerifyAccessToken,
  checkRole("ADMIN"),
  adminController.showAdmin
);
router.get(
  "/users",
  AdminVerifyAccessToken,
  checkRole("ADMIN"),
  adminController.users
);
router.get(
  "/oilChanger",
  AdminVerifyAccessToken,
  checkRole("ADMIN"),
  adminController.oilChanger
);
router.get(
  "/oilChanger/:id",
  AdminVerifyAccessToken,
  checkRole("ADMIN"),
  adminController.oilChangerData
);

router.get(
  "/oilChanger/image/:image/:id",
  AdminVerifyAccessToken,
  checkRole("ADMIN"),
  adminController.oilChangerImage
);

router.get(
  "/oilChanger/isOil/:id",
  AdminVerifyAccessToken,
  checkRole("ADMIN"),
  adminController.isOilChanger
);

router.get("/logout", (req, res, next) => {
  try {
    res.clearCookie("tokenKartSVD");
    return res.redirect("/admin/login");
  } catch (err) {
    next(err);
  }
});

module.exports = { webAdminRouter: router };
