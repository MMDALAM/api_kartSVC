const createError = require("http-errors");
const JWT = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = require("./constans");
const { userModel } = require("../models/users");
const bcrypt = require("bcrypt");
const { encode, decode } = require("urlencode");
const randomString = require("randomstring");
const { workServicesModel } = require("../models/workServices");
const fs = require("fs");
const path = require("path");
const https = require("https");
const UAParser = require("ua-parser-js");

function RandomNumber() {
  return Math.floor(Math.random() * 90000 + 10000);
}

function SignAccessToken(req, userId) {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(userId);
    const payload = {
      userID: user._id,
      agent: hashString(userAgent(req)),
    };
    const options = {
      expiresIn: "60d",
    };
    JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createError.InternalServerError("خطای سمت سرور"));
      resolve(token);
    });
  });
}

function SignRefreshToken(req, userId) {
  return new Promise(async (resolve, reject) => {
    const user = await userModel.findById(userId);
    const payload = {
      userID: user._id,
      agent: hashString(userAgent(req)),
    };
    const options = {
      expiresIn: "60d",
    };
    JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createError.InternalServerError("خطای سمت سرور"));
      resolve(token);
    });
  });
}

async function sendData(req, res, status, data) {
  const user = await userModel
    .findById(req.user.id, {
      otp: 0,
      password: 0,
      workServices: 0,
      updatedAt: 0,
      __v: 0,
    })
    .populate("oilChanger", "-_id name address phone idCard license")
    .populate("plate", "_id typePlate plate")
    .exec();
  return res.status(status).json({
    accessToken: await SignRefreshToken(req, req.user._id),
    data: {
      user,
      ...data,
    },
  });
}

function userAgent(req) {
  let parser = new UAParser();
  let ua = parser.setUA(req.get("User-Agent")).getResult();
  const ip = req.ip.replace(/^.*:/, "");
  return `${ua.browser.name}/${ua.browser.version}/${ua.os.name}/${ip}/Oil`;
}

function hashString(str) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(str, salt);
}

function comparePassword(bodyPass, password) {
  return bcrypt.compareSync(bodyPass, password);
}

function letters(plate) {
  let letter = decode(plate);
  const letters = [
    "ا",
    "ب",
    "پ",
    "ت",
    "ث",
    "ج",
    "چ",
    "ح",
    "خ",
    "د",
    "ذ",
    "ر",
    "ز",
    "ژ",
    "س",
    "ش",
    "ص",
    "ض",
    "ط",
    "ظ",
    "ع",
    "غ",
    "ف",
    "ق",
    "ک",
    "گ",
    "ل",
    "م",
    "ن",
    "و",
    "ه",
    "ی",
  ];
  if (letters.includes(letter)) return true;
  else throw createError.BadRequest("از حروف فارسی استفاده کنید");
}

async function uniqueSlug() {
  let string = randomString.generate({ length: 6 });
  let Services = await workServicesModel.findOne({ slug: string });
  if (Services) return uniqueSlug();
  return string;
}

function deleteFileInPublic(fileAddress) {
  if (fileAddress) {
    const pathFile = path.join(__dirname, "..", "..", fileAddress);
    if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
  }
}

function ListOfImagesFromReq(files, fileUploadPath) {
  if (files?.length > 0) {
    return files
      .map((file) => path.join(fileUploadPath, file.filename))
      .map((item) => item.replace(/\\/gi, "/"));
  } else {
    return [];
  }
}

async function sendCode(phone, code) {
  const data = JSON.stringify({
    bodyId: 220718,
    to: phone,
    args: [code],
  });

  const options = {
    hostname: "console.melipayamak.com",
    port: 443,
    path: "/api/send/shared/1fa3df8e7b374542b04e216196e18fe7",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": data.length,
    },
  };

  const req = https.request(options, (res) => {
    console.log("statusCode: " + res.statusCode);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

async function sendView(phone, p123, p4, Name, slug) {
  const data = JSON.stringify({
    bodyId: 220719,
    to: phone,
    args: [p4, p123, Name, slug],
  });

  const options = {
    hostname: "console.melipayamak.com",
    port: 443,
    path: "/api/send/shared/1fa3df8e7b374542b04e216196e18fe7",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  const req = https.request(options, (res) => {
    console.log("statusCode: " + res.statusCode);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });

  req.on("error", (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

module.exports = {
  RandomNumber,
  SignAccessToken,
  SignRefreshToken,
  hashString,
  comparePassword,
  userAgent,
  sendData,
  letters,
  uniqueSlug,
  deleteFileInPublic,
  ListOfImagesFromReq,
  sendCode,
  sendView,
};
