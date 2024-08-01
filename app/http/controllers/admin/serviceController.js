const controller = require("../controller");
const createError = require("http-errors");
const { sendData } = require("../../../utils/functions");
const { serviceModel } = require("../../../models/service");
const { serviceSchema } = require("../../validators/admin/admin.schema");

module.exports = new (class serviceController extends controller {
  async addService(req, res, next) {
    try {
      await serviceSchema.validateAsync(req.body);
      const { nameService } = req.body;
      if (!nameService)
        throw createError.BadRequest(" نام سرویس را وارد کنید ");
      await serviceModel.create({ nameService });
      return sendData(req, res, 200, { message: "خدمت ساخته شد" });
    } catch (err) {
      next(createError.BadRequest(err.message));
    }
  }

  async deleteService(req, res, next) {
    try {
      const { nameService } = req.body;
      const server = await serviceModel.findOneAndDelete({ nameService });
      if (!server) throw createError.BadRequest("سرویس مورد نظر پیدا نشد");

      return sendData(req, res, 200, { data: "خدمت حذف شد" });
    } catch (err) {
      next(createError.BadRequest(err.message));
    }
  }
})();
