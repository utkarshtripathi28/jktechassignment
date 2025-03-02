const roleController = require("../controllers/role");
const routes = require("express").Router();
const {verifyToken} = require('../utils/jwt');

routes.post("/addRole",verifyToken, roleController.addRole);
routes.get("/findAllRoles",verifyToken, roleController.findAll);
routes.put("/updateRole",verifyToken, roleController.updateRole);
routes.post("/deleteRole",verifyToken, roleController.deleteRole);

routes.post("/assignRole",verifyToken, roleController.assignRole);
routes.get("/findById",verifyToken, roleController.findById);
routes.get("/getRolesByApiEndPoints",verifyToken, roleController.getRolesByApiEndPoints);
routes.post("/deleteAssignedEndPointsByRoleId",verifyToken, roleController.deleteAssignedEndPointsByRoleId);
routes.post("/assignRoleByApiEndPointId",verifyToken, roleController.assignRoleByApiEndPointId);



module.exports = routes;
