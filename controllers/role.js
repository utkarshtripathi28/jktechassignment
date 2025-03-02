const db = require("../models")
const roles = db.roles;
const users = db.users;
const { resServerError, resErrorOccured, resDocCreated, resDocUpdated, resFound, resDocDeleted, resPaginationDoc } = require("../utils/response");
const { assignApiDefaultFunction } = require("./apiEndPoint");
const addRole = async (req, res) => {
  try {
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!req?.body?.name || req?.body?.name === "") return resErrorOccured(res,"Error in role name !!")
    if(regex.test(req?.body?.name)) return resErrorOccured(res, "Please provide valid name!!")
    req.body.isActive = 1
    const roleExist = await db.roles.findAll({
      where: {
        name: req?.body?.name,
        isActive: 1
      }
    });
    if(roleExist?.length > 0){
      return resErrorOccured(res, "Role name must be unique.");
    }else {
      let roleDoc = await roles.create(req.body);
      let apiAssignDef = await assignApiDefaultFunction()
      if (!apiAssignDef) return resErrorOccured(res, "Error in assigning APIs!!")
      return resDocCreated(res, roleDoc);
    }
  } catch (error) {
    return resServerError(res, error);
  }
};

const assignRole = async (req, res) => {
  try {
    let { body } = req;
    let arr = []
    for (let i of body) {
      arr.push(db.users.update({
        roleId: i.roleId
      }, {
        where: {
          Id: i.userId,
          isActive: 1
        }
      }))
    }
    let assign = await Promise.all(arr)
    return resDocUpdated(res, assign)
  } catch (error) {
    return resServerError(res, error);
  }
};


const findAll = async (req, res) => {
  try {
    const roleDoc = await roles.findAll({
      where: { isActive: 1 },
      order: [["name", "ASC"]]
    });
    return resFound(res, roleDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

const findById = async (req, res) => {
  try {
    let { id } = req.query;
    const roleDoc = await roles.findOne({ where: { Id: id } });
    return resFound(res, roleDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};


const updateRole = async (req, res) => {
  try {
    const { id } = req?.query ?? {};
    let body = req?.body ?? {};
    if(!body?.isActive){
      const userExist = await users.findAll({
        where: {
          roleId: id,
          isActive: 1
        }
      });
      if(userExist?.length > 0){
        return resErrorOccured(res, "Users are currently assigned to this role. It cannot be marked as inactive.");
      }
    }else{
      const roleExist = await roles.findAll({
        where: {
          name: req?.body?.name,
          isActive: 1
        }
      });
      if(roleExist?.length > 0 && id != roleExist[0]?.Id){
        return resErrorOccured(res, "Role name must be unique.");
      }
    }

    const isRecordUpdated = await roles.update(body, { where: { Id: id } });
    if (isRecordUpdated > 0) {
      let response = await roles.findOne({ where: { Id: id } });
      return resDocUpdated(res, response);
    } else {
      res.status(500).send({
        statusCode: "404",
        statusMessage: "Record not found",
      });
    }
  } catch (error) {
    return resServerError(res, error);
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.query;
    let roleDoc = await roles.destroy({ where: { Id: id } });
    return resDocDeleted(res, roleDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

const deleteMasterByEmpId = async (req, res) => {
  try {
    let id = req.query.id;
    let dataAfterDelete = employeeRoles.destroy({ where: { Id: id } });
    return resDocDeleted(res, dataAfterDelete);
  } catch (error) {
    return resServerError(res, error);
  }
};


const getRolesByApiEndPoints = async (req, res) => {
  try {
    let apiEndPointId = req.query.apiEndPointId
    let dataDoc = await db.apiEndPointRoles.findAll({
      where: {
        apiEndPointId: apiEndPointId
      },
      include: [{
        model: db.roles,
        as: 'endPointRoles',
        attributes: ["Id", "name", "isActive", "description"]
      }],
      attributes: ["Id", "roleId", "apiEndPointId"]
    })

    return resFound(res, dataDoc)
  } catch (error) {
    return resServerError(res, error);
  }
}
const assignRoleByApiEndPointId = async (req, res) => {
  try {
    let roleIds = req.body.roleIds
    let apiEndPointId = req.body.apiEndPointId
    let createDoc;
    for (let role of roleIds) {
      createDoc = await db.apiEndPointRoles.create({
        roleId: role,
        apiEndPointId: apiEndPointId
      })
    }
    return resDocCreated(res, "Document Created Succesfully...!!!")
  } catch (error) {
    return resServerError(res, error);
  }
}
const deleteAssignedEndPointsByRoleId = async (req, res) => {
  try {
    let roleId = req.query.roleId
    let apiEndPointId = req.query.apiEndPointId
    let deleteDoc = await db.apiEndPointRoles.destroy({
      where: {
        roleId: roleId,
        apiEndPointId: apiEndPointId
      }
    })
    if (deleteDoc !== 1)
      return resErrorOccured(res, "Please Select A Valid Role Id And EndPoint Id");
    return resDocDeleted(res, deleteDoc)
  } catch (error) {
    return resServerError(res, error);
  }
}

module.exports = { addRole, findById, updateRole, deleteRole, assignRole, deleteMasterByEmpId, findAll, getRolesByApiEndPoints, assignRoleByApiEndPointId, deleteAssignedEndPointsByRoleId };
