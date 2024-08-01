const { sendData } = require("../../../utils/functions");
const { authSchema } = require("../../validators/user/auth.schema");
const controller = require("../controller");
const createError = require("http-errors");

module.exports = new (class HomeController extends controller {
  async indexPage(req, res, next) {
    try {
      const data = { message: "سلامممم" };

      return sendData(req, res, 200, data);
    } catch (err) {
      next(err);
    }
  }
})();
