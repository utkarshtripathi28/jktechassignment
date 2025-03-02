const usersController = require("../controllers/users");
const routes = require("express").Router();
routes.post(
  "/addUsers",
  usersController.addUsers
);

module.exports = routes;
