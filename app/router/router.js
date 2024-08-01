const { adminRouter } = require("./api/v1/admin");
const { homeRouter } = require("./api/v1/api");
const { userAuthRouter } = require("./api/v1/user/auth");
const { userRouter } = require("./api/v1/user/user");
const { viewRouter } = require("./api/v1/view");
const { webAdminRouter } = require("./web/adminWeb");

const router = require("express").Router();

router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/user", userAuthRouter);
router.use("/api/v1/v", viewRouter);
router.use("/api/v1/", homeRouter);
router.use("/api/v1/profile", userRouter);
router.use("/api/admin", webAdminRouter);

module.exports = { AllRouters: router };
