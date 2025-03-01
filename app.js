let path = require("path");
let conf_file = path.join(__dirname, "./config/dbConfig.js");
let config = require(conf_file);
const express = require("express");
const app = express();
const db = require('./models/index')
const apiVersion = config.API_VERSION
const routes = require('./routes')
app.set("view engine", "ejs");
const cors = require("cors");

// middleware for retriving request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//cors
var whiteList = config.WHITELIST;
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));
app.use(`${apiVersion}/users`, routes.users);

app.use(`${apiVersion}/uploads`, express.static(path.join(__dirname, "uploads")));
app.use("/FileUploadMiddleware", express.static(path.join(__dirname, "FileUploadMiddleware")));
app.use("/views", express.static(path.join(__dirname, "views")));
app.use("/views/Images", express.static(path.join(__dirname, "views/Images")));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// const { uploadImageFilesTrigger } = require("./services/imagesToUploads");
// const { cronTrigger } = require("./node-cron");
const PORT = config.PORT;
const HOST = config.HOST;
app.listen(PORT, HOST, () => {
    console.log(`SAMPARK server is running on port http://${HOST}:${PORT}`);
  
  console.log(`HOSTNAME BY CONFIG EXPORT `, config.HOST);
});
