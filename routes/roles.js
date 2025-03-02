const roleController = require("../controllers/role");
const routes = require("express").Router();

routes.post("/addRole", roleController.addRole);
routes.get("/findAllRoles", roleController.findAll);
routes.put("/updateRole", roleController.updateRole);
routes.post("/deleteRole", roleController.deleteRole);

routes.post("/assignRole", roleController.assignRole);
routes.get("/findById", roleController.findById);
routes.get("/getRolesByApiEndPoints", roleController.getRolesByApiEndPoints);
routes.post("/deleteAssignedEndPointsByRoleId", roleController.deleteAssignedEndPointsByRoleId);
routes.post("/assignRoleByApiEndPointId", roleController.assignRoleByApiEndPointId);



module.exports = routes;
