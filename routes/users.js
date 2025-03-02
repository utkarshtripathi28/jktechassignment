const usersController = require("../controllers/users");
const routes = require("express").Router();
const {verifyToken} = require('../utils/jwt');
routes.post(
  "/addUsers",
  verifyToken,
  usersController.addUsers
);

module.exports = routes;
