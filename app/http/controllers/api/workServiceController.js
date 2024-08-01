const controller = require("../controller");
const createError = require("http-errors");
const {
  sendData,
  letters,
  uniqueSlug,
  RandomNumber,
  sendView,
} = require("../../../utils/functions");
const { plateModel } = require("../../../models/plate");
const { workServicesModel } = require("../../../models/workServices");
const { encode, decode } = require("urlencode");
const { userModel } = require("../../../models/users");
const { USER_ROLE } = require("../../../utils/constans");
const { serviceModel } = require("../../../models/service");
const { servicesSchema } = require("../../validators/api/api.schema");
const { oilChangerModel } = require("../../../models/oilChanger");
const persianjs = require("persianjs");

module.exports = new (class workServiceController extends controller {
  async addWorkServices(req, res, next) {
    try {
      await servicesSchema.validateAsync(req.body);
      const userId = req.user.id;
      const typeUser = req.user.isOilChanger ? "oilChanger" : "user";
      const oilChanger = req.user.isOilChanger ? req.user.oilChanger : null;
      const slug = await uniqueSlug();

      let { plate, phone, kmNow, services, oilName, description, car } =
        req.body;

      plate = this.englishNumber(plate);
      kmNow = this.englishNumber(kmNow);

      if (req.user.isOilChanger) {
        if (!phone)
          return res.status(400).json({
            errors: { phone: "موبایل را وارد کنید" },
          });
        phone = this.englishNumber(phone);
      }

      phone = phone ? phone : req.user.phone;
      let Next = req.body.kmNext ? parseInt(req.body.kmNext) : 5000;
      const kmNext = parseInt(kmNow) + parseInt(Next);
      let plates = await this.checkPlate(plate, phone);
      plate = plates.plate;

      if (description.length >= 300)
        return res.status(400).json({
          errors: { phone: "توضیحات نمیتواند بیشتر از 300 کاراکتر باشد" },
        });

      await this.checkUser(
        phone,
        plates.plateId,
        plates.oldPlate,
        plates.newPlate
      );

      const regex = /^09[0-9]{9}$/;
      const result = phone.match(regex);

      if (!result)
        return res.status(400).json({
          errors: { phone: " شماره موبایل را با 0 و صحیح وارد کنید " },
        });

      if (req.user.oilChanger) {
        const oilChangers = await oilChangerModel.findById(req.user.oilChanger);
        const p = plate.split("-");
        const p123 = `${p[0]} ${decode(p[1])} ${p[2]}`;
        const p4 = p[3];

        await sendView(phone, p4, p123, oilChangers.name, slug);
      }

      const nextTimeOilChang = this.reminder(Next);

      const service = await workServicesModel.create({
        phone,
        user: userId,
        services,
        typeUser,
        kmNow,
        kmNext,
        plate,
        oilName,
        oilChanger,
        slug,
        nextTimeOilChang,
        description,
        car,
      });
      return sendData(req, res, 200, { service, message: "سرویس ثبت شد" });
    } catch (err) {
      next(err);
    }
  }

  async listWorkServices(req, res, next) {
    try {
      let { plate } = req.params;
      plate = this.englishNumber(plate);

      let page = parseInt(req.query.page) || 1;
      let options = { sort: { createdAt: -1 }, limit: 10 };
      let defaultServices = await serviceModel.find(
        {},
        { createdAt: 0, updatedAt: 0, __v: 0 }
      );
      let time = new Date();

      let plat = plate.split("-");
      let plates;
      if (plat.length == 4) {
        letters(plat[1]);
        plates = `${plat[0]}-${encode(plat[1])}-${plat[2]}-${plat[3]}`;
      }
      // else {
      //   plates = plate;
      // }

      const plateVerify = await plateModel.findOne({ plate: plates });

      if (req.user.plate.includes(plateVerify?.id)) {
        const workService = await workServicesModel.paginate(
          { $and: [{ plate: plates }, { phone: req.user.phone }] },
          {
            options,
            page,
            populate: [
              { path: "services", select: "nameService" },
              { path: "user", select: "phone" },
              { path: "oilChanger", select: "name" },
            ],
          }
        );
        return sendData(req, res, 200, { workService, defaultServices, time });
      }

      if (req.user.isOilChanger) {
        const workService = await workServicesModel.paginate(
          { $and: [{ plate: plates }, { typeUser: "oilChanger" }] },
          {
            options,
            page,
            populate: [
              { path: "services", select: "nameService" },
              { path: "user", select: "phone" },
              { path: "oilChanger", select: "name" },
            ],
          }
        );
        return sendData(req, res, 200, { workService, defaultServices, time });
      }

      const workService = {
        docs: [],
        totalDocs: 1,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };

      return sendData(req, res, 200, { workService, defaultServices, time });
    } catch (err) {
      next(err);
    }
  }

  async checkPlate(plate, phone) {
    let newPlate;
    let typePlate;

    const oldPlate = await plateModel.findOne({ plate });

    if (!oldPlate) {
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
      newPlate = await plateModel.create({
        plate,
        ownerNumber: phone,
        typePlate,
      });
      plate = newPlate.plate;
    } else {
      let plat = plate.split("-");
      if (plat.length == 4) {
        letters(plat[1]);
      } else {
        if (plate.length === 5 || plate.length === 8) {
        } else
          throw createError.BadRequest("تعداد اعداد پلاک باید 5 یا 8 باشد");
      }
      plate = oldPlate.plate;
    }
    let plateId = !oldPlate ? newPlate.id : oldPlate.id;
    return (plate = { plateId, plate, newPlate, oldPlate });
  }

  async checkUser(phone, plateId, oldPlate, newPlate) {
    let newUser;
    const users = await userModel.findOne({ phone });

    if (!users) {
      const code = RandomNumber();
      let otp = {
        code,
        expiresIn: new Date().getTime() + 120000,
      };
      newUser = await userModel.create({
        phone,
        otp,
        plate: plateId,
        Roles: [USER_ROLE],
      });

      if (!oldPlate) await newPlate.save();
      else await oldPlate.save();
    } else {
      if (!users.plate.includes(plateId)) {
        users.plate.push(plateId);
        await users.save();
      }
    }
    return;
  }

  async deleteService(req, res, next) {
    try {
      const { slug } = req.params;
      const workService = await workServicesModel.findOne({ slug });
      if (!workService) throw createError.BadRequest("سرویس پیدا نشد");
      // let time = Math.abs(
      //   (new Date().getTime() - workService.updatedAt.getTime()) / 1000
      // );

      // const hours = Math.floor(time / 3600);

      // if (hours <= 48) {
      await workServicesModel.deleteOne({ slug });
      return sendData(req, res, 200, { message: " سرویس حذف شد " });
      // }

      // return sendData(req, res, 200, {
      //   message: " تاریخ حذف سرویس گذشته است ",
      // });
    } catch (err) {
      next(err);
    }
  }

  reminder(km) {
    let result =
      km >= 1000 && km <= 3000
        ? 2
        : km >= 4000 && km <= 7000
        ? 3
        : km >= 8000 && km <= 10000
        ? 4
        : "عدد رد شد";
    let date = new Date();
    const newMonth = date.getMonth() + result;
    date.setMonth(newMonth);
    return date.toISOString().split("T")[0];
  }

  englishNumber(num) {
    return persianjs(num).persianNumber().toString();
  }
})();
