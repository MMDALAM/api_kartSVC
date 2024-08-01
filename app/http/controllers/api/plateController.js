const controller = require("../controller");
const createError = require("http-errors");
const { sendData, letters } = require("../../../utils/functions");
const { plateModel } = require("../../../models/plate");
const { encode, decode } = require("urlencode");
const { plateSchema } = require("../../validators/api/api.schema");

module.exports = new (class serviceController extends controller {
  async addPlate(req, res, next) {
    try {
      await plateSchema.validateAsync(req.body);
      let { typePlate, plate } = req.body;
      const users = req.user.id;

      let plat = plate.split("-");
      if (plat.length == 4) {
        letters(plat[1]);
        typePlate = 0;
      } else {
        if (plate.length === 5 || plate.length === 8) {
          typePlate = plate.length === 5 ? 2 : 1;
        } else
          throw createError.BadRequest("تعداد اعداد پلاک باید 5 یا 8 باشد");
      }

      await plateModel.create({
        typePlate,
        plate,
        users,
        ownerNumber: req.user.phone,
      });
      return sendData(req, res, 200, { message: "پلاک ثبت شد" });
    } catch (err) {
      next(err);
    }
  }

  async deletePlate(req, res, next) {
    try {
      const { plate } = req.params;
      if (!plate) throw createError.BadRequest(" پلاک را وارد کنید ");

      let plat = plate.split("-");
      let platess;
      if (plat.length == 4) {
        letters(plat[1]);
        platess = `${plat[0]}-${encode(plat[1])}-${plat[2]}-${plat[3]}`;
      } else {
        platess = plate;
      }

      await workServicesModel.deleteOne({ plate: platess }, function (err) {
        if (err) throw createError.BadRequest(" پلاک حذف نشد ");
      });

      return sendData(req, res, 200, "پلاک مورد نظر شما حذف شد");
    } catch (err) {
      next(err);
    }
  }
})();
