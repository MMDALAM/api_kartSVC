const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createError = require("http-errors");

function createDir(req) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (1 + date.getMonth()).toString();
  const day = date.getDay().toString();
  const dir = path.join(
    __dirname,
    "..",
    "..",
    "uploads",
    "oilChanger",
    year,
    month,
    day
  );

  req.body.fileUploadPath = path.join(
    "uploads",
    "oilChanger",
    year,
    month,
    day
  );
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file?.originalname) {
      const filePath = createDir(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    if (file?.originalname) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.filename = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname);
  const mimetypes = [".jpg", ".jpeg", ".png", "webp", ".gif"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createError.BadRequest("فرمت تصویر ارسال شده صحیح نمیباشد"));
}

const maxSize = 5 * 1000 * 1000;
const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = {
  uploadFile,
};
