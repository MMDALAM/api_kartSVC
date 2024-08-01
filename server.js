require("app-module-path").addPath(__dirname);

const Application = require("./app/server");
new Application(4000, "mongodb://127.0.0.1:27017/kartsvc");
// new Application(
//   4000,
//   "mongodb+srv://mmdalam:Mm11337788@cluster0.zf6rcuf.mongodb.net/"
// );
