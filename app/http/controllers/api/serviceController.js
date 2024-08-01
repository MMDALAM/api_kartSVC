const controller = require("../controller");
const createError = require("http-errors");
const { serviceModel } = require("../../../models/service");
const { sendData } = require("../../../utils/functions");

module.exports = new (class serviceController extends controller {
  async allService(req, res, next) {
    try {
      const defaultServices = await serviceModel.find(
        {},
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
      return sendData(req, res, 200, { defaultServices });
    } catch (err) {
      next(err);
    }
  }
})();
