const controller = require("../controller");
const createError = require("http-errors");
const { sendData, deleteFileInPublic } = require("../../../utils/functions");
const { oilChangerModel } = require("../../../models/oilChanger");
const {
  oilChangerSchema,
  oilChangerImageSchema,
} = require("../../validators/api/api.schema");
const path = require("path");
const { userModel } = require("../../../models/users");

module.exports = new (class oilChangerController extends controller {
  async addOilChanger(req, res, next) {
    try {
      let users = req.user;
      const userOilChanger = await oilChangerModel.findById(users.oilChanger);

      if (userOilChanger) {
        let update = {};
        req.body.workName ? (update.name = req.body.workName) : "";
        req.body.workPhone ? (update.phone = req.body.workPhone) : "";
        req.body.workAddress ? (update.address = req.body.workAddress) : "";

        await oilChangerModel.findByIdAndUpdate(users.oilChanger, {
          $set: { ...update },
        });

        return sendData(req, res, 200, {
          message: "تعویض روغنی ویرایش شد",
        });
      } else {
        await oilChangerSchema.validateAsync(req.body);
        let { workName, workAddress, workPhone } = req.body;

        const oilChanger = await oilChangerModel.create({
          name: workName,
          address: workAddress,
          phone: workPhone,
        });
        users.oilChanger = oilChanger._id;
        await users.save();

        return sendData(req, res, 200, { message: "تعویض روغنی ثبت شد" });
      }
    } catch (err) {
      next(err);
    }
  }

  async imageOilChanger(req, res, next) {
    try {
      // await oilChangerImageSchema.validateAsync(req.body);
      const user = req.user;
      const oilChanger = await oilChangerModel.findById(user.oilChanger);

      if (!oilChanger) throw createError.BadRequest("تعویض روغنی پیدا نشد");

      req.body.image = path.join(req.body.fileUploadPath, req.body.filename);
      let image = `./${req.body.image.replace(/\\/gi, "/")}`;
      let imageUrl = `${process.env.WEBSITE_URL}/uploads/${image}`;

      // let image = "https://img9.irna.ir/d/r2/2020/05/26/4/157145607.jpg";
      // let imageUrl = "https://img9.irna.ir/d/r2/2020/05/26/4/157145607.jpg";

      if (req.body.typeImage == "license") {
        oilChanger.license = {
          status: 1,
          message: "منتظر تایید",
          image: image,
          url: imageUrl,
        };
        await oilChanger.save();
        return sendData(req, res, 200, {
          message: "عکس پروانه کسب شما ذخیره شد",
        });
      }

      if (req.body.typeImage == "idCard") {
        oilChanger.idCard = {
          status: 1,
          message: "منتظر تایید",
          image: image,
          url: imageUrl,
        };
        await oilChanger.save();
        return sendData(req, res, 200, {
          message: "عکس کارت ملی شما ذخیره شد",
        });
      }

      throw createError.BadRequest("نوع عکس معتبر نیست");
    } catch (err) {
      deleteFileInPublic(req.body.image);
      next(createError.BadRequest(err.message));
    }
  }
})();
