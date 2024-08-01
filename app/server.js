const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");
const app = express();
const { AllRouters } = require("./router/router");
const createError = require("http-errors");
const morgan = require("morgan");
const cors = require("cors");
const { deleteFileInPublic } = require("./utils/functions");
require("dotenv").config();
const ExpressEjsLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");

module.exports = class Application {
  #DB_URI;
  #PORT;
  constructor(PORT, DB_URI) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.configApplication();
    this.createServer();
    this.connectToMongoDB();
    this.initTemplateEngin();
    this.createRoutes();
    this.errorHandling();
  }

  configApplication() {
    app.use(cors());
    app.use(morgan("dev"));
    app.set("trust proxy", true);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(cookieParser());
  }

  createServer() {
    const http = require("http");
    http.createServer(app).listen(this.#PORT, () => {
      console.log("run > http://localhost:" + this.#PORT);
    });
  }

  connectToMongoDB() {
    mongoose.Promise = global.Promise;
    mongoose.set("strictPopulate", false);
    mongoose.set("strictQuery", false);
    mongoose.connect(this.#DB_URI);
    mongoose.connection.on("error", (err) => {
      console.log("failed to connect to MongoDB");
      return console.log(err.message);
    });
    mongoose.connection.on("connected", () => {
      console.log("mongoose connected to DB");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("mongoose disconnected");
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("disconnected");
      process.exit(0);
    });
  }

  initTemplateEngin() {
    app.use(express.static(path.resolve(__dirname, `../../dist`)));
    app.use(ExpressEjsLayouts);
    app.set("view engine", "ejs");
    app.set("views", "./resource/views");
    app.set("layout extractStyles", true);
    app.set("layout extractScripts", true);
    app.set("layout", "./master");
  }

  createRoutes() {
    app.get(/^(?!\/api\/)/, (_, res) => {
      res.sendFile(path.resolve("../index.html"));
    });
    app.use(AllRouters);
  }

  errorHandling() {
    app.use((req, res, next) => {
      next(createError.NotFound("آدرس مورد نظر یافت نشد"));
    });
    app.use((err, req, res, next) => {
      const serverError = createError.BadRequest();
      const statusCode = err.status || serverError.status;
      const message = err.message || serverError.message;
      if (req.file) {
        req.body.image = path.join(req.body.fileUploadPath, req.body.filename);
        let image = req.body.image.replace(/\\/gi, "/");
        deleteFileInPublic(image);
      }
      if (err.details) {
        let errors = {};
        let key;
        let value;
        err.details.forEach((e) => {
          key = e.context.key;
          value = e.message;
          errors[key] = value;
        });
        return res.status(statusCode).json({
          errors,
        });
      }
      return res.status(statusCode).json({
        message,
      });
    });
  }
};
