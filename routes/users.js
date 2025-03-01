const usersController = require("../controllers/users");
const routes = require("express").Router();
routes.post(
  "/addUsers",
//   validateAPIAccess,
  usersController.addUsers
);

module.exports = routes;
