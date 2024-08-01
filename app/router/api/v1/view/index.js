const viewController = require("../../../../http/controllers/api/viewController");

const router = require("express").Router();

router.get("/:slug/s", viewController.viewServices);

module.exports = { viewRouter: router };
