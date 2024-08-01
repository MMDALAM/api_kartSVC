const { workServicesModel } = require("../../../models/workServices");
const controller = require("../controller");
const createError = require("http-errors");

module.exports = new (class HomeController extends controller {
  async reminders(req, res, next) {
    try {
      const workServices = await workServicesModel.find({});
      const date = new Date().toISOString().split("T")[0];

      workServices.forEach((service) => {
        if (service.nextTimeOilChang.toISOString().split("T")[0] == date) {
          console.log("sms");
        }
      });
      return res.json({
        data: {
          message: "یادآوری تکمیل شد",
        },
      });
    } catch (err) {
      next(err);
    }
  }
})();
