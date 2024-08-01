const { oilChangerModel } = require("../../../models/oilChanger");
const { userModel } = require("../../../models/users");
const { workServicesModel } = require("../../../models/workServices");
const {
  SignAccessToken,
  comparePassword,
} = require("../../../utils/functions");
const controller = require("../controller");
// const moment = require("moment");
const moment = require("jalali-moment");
moment.locale("fa", { useGregorianParser: true });
const createError = require("http-errors");

class adminController extends controller {
  async showAdmin(req, res, next) {
    try {
      let userCount = await userModel.find({});
      let serviceCount = await workServicesModel.find({});

      const startMonth = moment().subtract("months").startOf("month");
      const endMonth = moment().subtract("months").endOf("month");

      const startDay1 = moment().subtract("days").startOf("day");
      const endDay1 = moment().subtract("days").endOf("day");

      const startDay2 = moment().subtract(1, "days").startOf("day");
      const endDay2 = moment().subtract(1, "days").endOf("day");

      const startDay3 = moment().subtract(2, "days").startOf("day");
      const endDay3 = moment().subtract(2, "days").endOf("day");

      const startDay4 = moment().subtract(3, "days").startOf("day");
      const endDay4 = moment().subtract(3, "days").endOf("day");

      const startDay5 = moment().subtract(4, "days").startOf("day");
      const endDay5 = moment().subtract(4, "days").endOf("day");

      const startDay6 = moment().subtract(5, "days").startOf("day");
      const endDay6 = moment().subtract(5, "days").endOf("day");

      const startDay7 = moment().subtract(6, "days").startOf("day");
      const endDay7 = moment().subtract(6, "days").endOf("day");

      const startDayM = moment().subtract(30, "days").startOf("day");
      const endDayM = moment().subtract("days").endOf("day");

      const users1 = await userModel.find({
        createdAt: {
          $gte: startDay1,
          $lt: endDay1,
        },
      });

      const users2 = await userModel.find({
        createdAt: {
          $gte: startDay2,
          $lt: endDay2,
        },
      });

      const users3 = await userModel.find({
        createdAt: {
          $gte: startDay3,
          $lt: endDay3,
        },
      });

      const users4 = await userModel.find({
        createdAt: {
          $gte: startDay4,
          $lt: endDay4,
        },
      });

      const users5 = await userModel.find({
        createdAt: {
          $gte: startDay5,
          $lt: endDay5,
        },
      });

      const users6 = await userModel.find({
        createdAt: {
          $gte: startDay6,
          $lt: endDay6,
        },
      });

      const users7 = await userModel.find({
        createdAt: {
          $gte: startDay7,
          $lt: endDay7,
        },
      });

      const usersM = await userModel.find({
        createdAt: {
          $gte: startDayM,
          $lt: endDayM,
        },
      });

      let url = req.url;

      let serviceDay = await workServicesModel.find({
        createdAt: {
          $gte: startDay1,
          $lt: endDay1,
        },
      });

      let serviceMonth = await workServicesModel.find({
        createdAt: {
          $gte: startMonth,
          $lt: endMonth,
        },
      });

      return res.render("index", {
        userCount,
        startDay1,
        startDay2,
        startDay3,
        startDay4,
        startDay5,
        startDay6,
        startDay7,
        users1,
        users2,
        users3,
        users4,
        users5,
        users6,
        users7,
        usersM,
        moment,
        url,
        serviceCount,
        serviceDay,
        serviceMonth,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      let url = req.url;
      return res.render("login", { url });
    } catch (err) {
      next(err);
    }
  }

  async checkLogin(req, res, next) {
    try {
      const pass = req.body.password.length;
      if (8 >= pass || 20 <= pass) return alert("رمز عبور را کامل وارد کنید");
      const { phone, password } = req.body;
      const user = await userModel.findOne({ phone });

      if (!user) throw createError.BadRequest("کاربر یافت نشد ");
      if (!comparePassword(password, user.password))
        throw createError.BadRequest("رمز عبور وارد شده صحیح نمیباشد");

      const accessToken = await SignAccessToken(req, user._id);
      res.cookie("tokenKartSVD", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 60 * 60 * 1000),
        secure: true,
      });

      return res.redirect("/api/admin");
    } catch (err) {
      next(err);
    }
  }

  async users(req, res, next) {
    try {
      let page = parseInt(req.query.page) || 1;
      let options = { sort: { createdAt: -1 }, limit: 10 };

      const users = await userModel.paginate(
        {},
        {
          options,
          page,
          populate: [
            { path: "oilChanger", select: ["id", "name", "address", "phone"] },
            { path: "plate", select: "plate" },
          ],
        }
      );

      let url = req.url;

      return res.render("users", { users, url });
    } catch (err) {
      next(err);
    }
  }

  async oilChanger(req, res, next) {
    try {
      let page = parseInt(req.query.page) || 1;
      let options = { sort: { createdAt: -1 }, limit: 10 };

      const users = await userModel.paginate(
        { oilChanger: { $ne: null } },
        {
          options,
          page,
          populate: [
            { path: "oilChanger", select: "" },
            { path: "plate", select: "plate" },
          ],
        }
      );

      let url = req.url;

      return res.render("oilChanger", { users, url });
    } catch (err) {
      next(err);
    }
  }

  async oilChangerData(req, res, next) {
    try {
      const users = await userModel
        .findById(req.params.id)
        .populate("oilChanger", "")
        .populate("plate", "typePlate plate ")
        .exec();

      let url = req.url;

      return res.render("oilChangerData", { moment, users, url });
    } catch (err) {
      next(err);
    }
  }

  async oilChangerImage(req, res, next) {
    try {
      const oilChanger = await oilChangerModel.findById(req.params.id);

      if (req.params.image == "license") {
        oilChanger.license = {
          status: 3,
          message: "تایید شده",
          image: oilChanger.license.image,
          url: oilChanger.license.url,
        };
        await oilChanger.save();
        return this.back(req, res);
      } else {
        oilChanger.idCard = {
          status: 3,
          message: "تایید شده",
          image: oilChanger.license.image,
          url: oilChanger.license.url,
        };
        await oilChanger.save();
        return this.back(req, res);
      }
    } catch (err) {
      next(err);
    }
  }

  async isOilChanger(req, res, next) {
    try {
      const user = await userModel.findOne({ oilChanger: req.params.id });
      console.log(!user.isOilChanger);

      user.isOilChanger = !user.isOilChanger;
      await user.save();
      return this.back(req, res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new adminController();
