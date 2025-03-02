const apiEndPointController = require("../controllers/apiEndPoint");
const routes = require("express").Router();

routes.post("/addApiEndPoint", apiEndPointController.addApiEndPoint);

routes.post("/assignApiRole", apiEndPointController.assignApiRole);
routes.post("/apisAssignedDefault", apiEndPointController.apisAssignedDefault);

routes.get("/getApiByRoleId", apiEndPointController.getApiByRoleId);
routes.get("/findAllEndpoints", apiEndPointController.findAll);


routes.put("/updateApiEndPoint", apiEndPointController.updateApiEndPoint);

routes.put("/grantAPIPermission", apiEndPointController.grantAPIPermission);

routes.post("/deleteApiEndPoint", apiEndPointController.deleteApiEndPoint);

routes.post("/deleteApiEndPointRoles", apiEndPointController.deleteApiEndPointRoles);


module.exports = routes;
