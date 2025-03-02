const apiEndPointController = require("../controllers/apiEndPoint");
const routes = require("express").Router();
const {verifyToken} = require('../utils/jwt');

routes.post("/addApiEndPoint", verifyToken, apiEndPointController.addApiEndPoint);

routes.post("/assignApiRole", verifyToken, apiEndPointController.assignApiRole);
routes.post("/apisAssignedDefault", verifyToken, apiEndPointController.apisAssignedDefault);

routes.get("/getApiByRoleId", verifyToken, apiEndPointController.getApiByRoleId);
routes.get("/findAllEndpoints", verifyToken, apiEndPointController.findAll);


routes.put("/updateApiEndPoint", verifyToken, apiEndPointController.updateApiEndPoint);

routes.put("/grantAPIPermission", verifyToken, apiEndPointController.grantAPIPermission);

routes.post("/deleteApiEndPoint", verifyToken, apiEndPointController.deleteApiEndPoint);

routes.post("/deleteApiEndPointRoles", verifyToken, apiEndPointController.deleteApiEndPointRoles);


module.exports = routes;
