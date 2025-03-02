const pageController = require("../controllers/page");
const routes = require("express").Router();

routes.post("/addPages", pageController.addPages);
routes.post("/assignPageRole", pageController.assignPageRole);
routes.post("/postAllPages", pageController.postAllPages);
routes.post("/rolesAssignedDefault", pageController.rolesAssignedDefault);

routes.get("/findAllPages", pageController.findAll);

routes.get("/findRoleByPageId",pageController.findRoleByPageId);

routes.get("/findById", pageController.findById);

routes.put("/updatePage", pageController.updatePage);
routes.put("/grantPagePermission", pageController.grantPagePermission);

routes.post("/deletePage", pageController.deletePage);

module.exports = routes;
