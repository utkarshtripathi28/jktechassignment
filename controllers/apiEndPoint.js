const db = require("../models");
let apiEndPoints = db.apiEndPoints;
let apiEndPointRoles = db.apiEndPointRoles;

const { resServerError, resDocCreated, resAlreadyExists, resDocUpdated, resFound, resDocDeleted, resPaginationDoc, resErrorOccured } = require("../utils/response");
const { paginate } = require("../utils/pagination");

const addApiEndPoint = async (req, res) => {
  try {
    let apiDoc = await apiEndPoints.create(req.body);
    return resDocCreated(res, apiDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

const updateApiEndPoint = async (req, res) => {
  try {
    const { id } = req.query;
    let body = req.body;
    const isRecordUpdated = await apiEndPoints.update(body, { where: { Id: id } });
    if (isRecordUpdated > 0) {
      let response = await apiEndPoints.findOne({ where: { Id: id } });
      return resDocUpdated(res, response);
    } else {
      res.status(500).send({
        statusCode: "500",
        statusMessage: "Record not found",
      });
    }
  } catch (error) {
    return resServerError(res, error);
  }
};

const getApiByRoleId = async (req, res) => {
  try {
    let { roleId } = req.query;
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 100;
    const { count, rows } = await apiEndPoints.findAndCountAll({
      attributes: ["name", "apiEndPoint"],
      offset: (page - 1) * limit,
      limit: limit,
      distinct: true,
      include: [
        {
          model: apiEndPointRoles,
          as: "apiEndPointRolesData",
          where: {
            roleId: roleId,
          },
          attributes: ["Id"],
          required: true,
        },
      ],
      order: [["apiEndPointRolesData", "createdAt", "DESC"], ["apiEndPointRolesData", "updatedAt", "DESC"]]
    });
    const result = await paginate({
      data: rows,
      count: count,
      page,
      limit,
    });
    return resPaginationDoc(res, result.data, result.pagination);
  } catch (error) {
    return resServerError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 10
    // getPageLimit.getPageLimit
    const { count, rows } = await apiEndPoints.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
      distinct: true,
      order: [
        ["createdAt", "DESC"],
        ["updatedAt", "DESC"]
      ],
    });
    const result = await paginate({
      data: rows,
      count: count,
      page,
      limit,
    });
    return resPaginationDoc(res, result.data, result.pagination);
  } catch (error) {
    return resServerError(res, error);
  }
};

const deleteApiEndPoint = async (req, res) => {
  try {
    const { id } = req.query;
    let apiDoc = await apiEndPoints.destroy({ where: { Id: id } });
    return resDocDeleted(res, apiDoc);
  } catch (error) {
    return res.status(500).send({ statusCode: "500", statusMessage: "Error!", error: error });
  }
};

const assignApiRole = async (req, res) => {
  try {
    let { body } = req;
    let docs = []
    for (let i of body) {
      docs.push(await apiEndPointRoles.create({
        apiEndPointId: i.apiEndPointId,
        roleId: i.roleId,
        isActive: i.isActive
      })
      )
    }
    let assignApiRoleDoc = await Promise.all(docs)
    if (assignApiRoleDoc.length !== 0) return resDocCreated(res, assignApiRoleDoc);
    return resErrorOccured(res, "Error!!")
  } catch (error) {
    console.error(error);
    return resServerError(res, error);
  }
};

const deleteApiEndPointRoles = async (req, res) => {
  try {
    const { id } = req.query;
    let apiDoc = await apiEndPointRoles.destroy({ where: { Id: id } });
    return resDocDeleted(res, apiDoc);
  } catch (error) {
    return res.status(500).send({ statusCode: "500", statusMessage: "Error!", error: error });
  }
};

const apisAssignedDefault = async (req, res) => {
  try {
    let interArr = await assignApiDefaultFunction()
    let promise = await Promise.all(interArr)
    if (promise) return resDocUpdated(res, promise)
    return resErrorOccured(res, "Error Occured")
  } catch (error) {
    return resServerError(res, error)
  }
}


const assignApiDefaultFunction = async() =>{
  try {
    let interArr = []
    let apis = await apiEndPoints.findAll()
    let roles = await db.roles.findAll()
    apis.forEach((a) => {
      roles.forEach(async (r) => {
        let inter = await apiEndPointRoles.findOne({
          where: {
            roleId: r.Id,
            apiEndPointId: a.Id
          }
        })
        if (!inter) interArr.push(apiEndPointRoles.create({
          roleId: r.Id,
          apiEndPointId: a.Id,
          isActive: 0
        }))
      })
    })
    return interArr
    
  } catch (error) {

    throw error 
  }
    

}

const grantAPIPermission = async (req, res) => {
  try {
    let { roleId } = req.query
    let permitArr = []
    for (let body of req.body) {
      let permissionB = apiPermissionBody(body)
      let apiEndPointRole = await db.apiEndPointRoles.findOne({
        where: {
          apiEndPointId: body.apiEndPointId,
          roleId
        }
      })
      if (apiEndPointRole) {
        permitArr.push(apiEndPointRole.update(permissionB))
      }
    }
    let promise = await Promise.all(permitArr)
    if (promise) return resDocUpdated(res, promise)
    return resErrorOccured(res, "Error giving permission!!")
  } catch (error) {
    return resServerError(res, error)
  }
}

function apiPermissionBody(body) {
  let updateBody = {
    isActive: body.isActive
  }
  return updateBody
}

const getApiEndpointByPageId = async (req, res) => {
  try {
    let { pageId, roleId } = req.query
    let apis = await db.apiEndPoints.findAll({
      where: {
        pageId
      },
      include: [{
        model: db.apiEndPointRoles,
        as: "apiEndPointRoles",
        where: {
          roleId
        }
      }]
    })
    if (apis.length > 0) return resFound(res, apis)
    return resErrorOccured(res, "No API Found in this page!")
  } catch (error) {
    return resServerError(res, error)
  }
}
module.exports = { assignApiDefaultFunction,addApiEndPoint, updateApiEndPoint, getApiByRoleId, findAll, deleteApiEndPoint, assignApiRole, deleteApiEndPointRoles, apisAssignedDefault, grantAPIPermission, getApiEndpointByPageId };
