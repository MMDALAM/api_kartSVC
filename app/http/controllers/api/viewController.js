const controller = require("../controller");
const { workServicesModel } = require("../../../models/workServices");
const createError = require("http-errors");
const { serviceModel } = require("../../../models/service");

module.exports = new (class HomeController extends controller {
  async viewServices(req, res, next) {
    try {
      const { slug } = req.params;
      let defaultServices = await serviceModel.find(
        {},
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );

      const workService = await workServicesModel
        .findOne({ slug }, { updatedAt: 0, __v: 0 })
        .populate("services", "nameService")
        .populate("user", "phone")
        .populate("oilChanger", "name")
        .exec();

      return res.status(200).json({
        data: { workService, defaultServices },
      });
    } catch (err) {
      next(err);
    }
  }
})();
