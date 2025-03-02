let path = require("path");
let conf_file = path.join(__dirname, "./config/dbConfig.js");
let config = require(conf_file);
const express = require("express");
const app = express();
const db = require('./models')
const expressListRoutes = require("./utils/dumpRoutes");
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
app.use(`${apiVersion}/roles`, routes.roles);
app.use(`${apiVersion}/auth`, routes.auth);
app.use(`${apiVersion}/media`, routes.media);
app.use(`${apiVersion}/apiEndPoints`, routes.apiEndPoints);
app.post("/api/v1/storeAllEndpoints", async (req, res) => {
  try {
    let stack = expressListRoutes(app);

    let bulkArray = [];
    let stackUnique = [];
    let apiDoc;
    let roleDoc = await db.roles.findOne({
      where: {
        name: "Admin",
      },
      attributes: ["Id"],
    });
    stack.forEach((c) => {
      if (!stackUnique.includes(c)) {
        stackUnique.push(c);
      }
    });

    for (let i in stackUnique) {
      let a = stackUnique[i].split("/");
      let url = a[a.length - 1];
      if (url !== undefined) {
        let doc = await db.apiEndPoints.count({
          where: { apiEndPoint: stackUnique[i] },
        });
        if (doc === 0) {
          bulkArray.push({
            name: url,
            apiEndPoint: stackUnique[i],
            description: url,
          });
        }
      }
    }

    if (bulkArray.length > 0) {
      apiDoc = await db.apiEndPoints.bulkCreate(bulkArray);
      let endpointsToAssign = [];
      if (apiDoc.length > 0) {
        if (roleDoc !== null) {
          for (let api of apiDoc) {
            endpointsToAssign.push(
              db.apiEndPointRoles.create({
                apiEndPointId: api.Id,
                roleId: roleDoc.Id,
                isActive: 1,
              })
            );
          }

          let executed = await Promise.all(endpointsToAssign);

          if (executed.length > 0) {
            return res.status(200).send({
              statusCode: "200",
              statusMessage: "All Endpoints stored in db and assigned to admin",
              data: apiDoc,
            });
          } else
            return res.status(203).send({
              statusCode: "203",
              statusMessage: "No routes assigned to admin!",
              data: executed,
            });
        } else
          return res.status(203).send({
            statusCode: "203",
            statusMessage: "No roles found as admin",
            data: roleDoc,
          });
      } else
        return res.status(203).send({
          statusCode: "203",
          statusMessage: "No routes registered!",
          data: apiDoc,
        });
    }
    return res.status(203).send({
      statusCode: "203",
      statusMessage: "No routes registered!",
      data: apiDoc,
    });
  } catch (error) {
    return res.status(203).send({
      statusCode: "500",
      statusMessage: "Internal server error",
      error: error,
    });
  }
});
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
