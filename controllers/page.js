const db = require("../models");
const pageMenu = db.pageMenu;
const rolePages = db.rolePages;

const page = db.page;
const { resServerError, resErrorOccured, resDocCreated, resAlreadyExists, resDocUpdated, resFound, resDocDeleted, resPaginationDoc } = require("../utils/response");
const { paginate } = require("../utils/pagination");

const addPages = async (req, res) => {
  try {
    let pagesDoc = await page.create(req.body);
    return resDocCreated(res, pagesDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};


const assignPageRole = async (req, res) => {
  try {
    let { body } = req;

    let _body = body.map((record) => {
      return rolePages.create({
        pageId: record.pageId,
        roleId: record.roleId,
      });
    });
    let doc = await Promise.all(_body);
    if (doc.length !== 0) return resDocCreated(res, doc);
    return resErrorOccured(res, "Please provide correct data");
  } catch (error) {
    if (error.errors) {
      if (error.errors[0].validatorKey === "not_unique") {
        return res.status(203).send({ statusCode: "203", statusMessage: "You have already assiged this page to above role", error: [] });
      }
    }
    return resServerError(res, error);
  }
};

const findRoleByPageId = async (req, res) => {
  try {
    let { body } = req;
    let _body = body.roleId.map((record) => {
      let requestBody = {
        roleId: record.Id,
        pageId: body.pageId,
      };
      return rolePages.create(requestBody);
    });

    Promise.all(_body)
      .then((dataAfterInsert) => {
        return resDocCreated(res, dataAfterInsert);
      })
      .catch((errorAfterInsert) => {
        return resErrorOccured(res, errorAfterInsert);
      });
  } catch (error) {
    return resServerError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const limit = 10
    // getPageLimit.getPageLimit
    const { count, rows } = await db.page.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
      distinct: true,
      order: [
        ["createdAt", "DESC"],
        ["updatedAt", "DESC"],
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

const findById = async (req, res) => {
  try {
    let { id } = req.query;
    const pagesDoc = await page.findAll({ where: { Id: id } });
    return resFound(res, pagesDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

const updatePage = async (req, res) => {
  try {
    const { id } = req.query;
    let body = getRequestBody(req.body);
    const isRecordUpdated = await page.update(req.body, { where: { Id: id } });
    if (isRecordUpdated > 0) {
      let response = await page.findOne({ where: { Id: id } });
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

const deletePage = async (req, res) => {
  try {
    const { id } = req.query;
    let pagesDoc = await page.destroy({ where: { Id: id } });
    return resDocDeleted(res, pagesDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

function getRequestBody(body) {
  let info = {
    name: body.name,
    displayName: body.displayName,
  };
  return info;
}


const postAllPages = async (req, res) => {
  try {
    let { body } = req
    let pages = await page.findAll()
    let routesArr = []
    let pagePromise = []
    pages.forEach((p) => {
      routesArr.push(p.route.split('/')[1])
    })
    body.forEach((e) => {
      if (!routesArr.includes(e.path) && e.path != '') {
        pagePromise.push(page.create({
          route: `/${e.path}`,
          isActive: 1,
          name: e.path,
          displayName: caps(e.path)
        }))
      }
    });
    if (pagePromise.length > 0) {
      let addPages = await Promise.all(pagePromise)
      if (addPages) {
        let aPArr = []
        let admin = await db.roles.findOne({
          where: {
            name: 'Admin',
            isActive: 1
          },
          attributes: ['Id']
        })
        addPages = addPages.map((x) => x.get({ plain: true }))
        addPages.forEach(async (ap) => {
          let adminRole = await db.rolePages.findOne({
            where: {
              roleId: admin.Id,
              pageId: ap.Id
            }
          })
          if (!adminRole) {
            aPArr.push(db.rolePages.create({
              roleId: admin.Id,
              pageId: ap.Id,
              isActive: 1
            }))
          }
        })
        let promise = await Promise.all(aPArr)
        if (promise) return resDocCreated(res, "Pages Entry Successful")
        return resErrorOccured(res, "Pages couldn't be assigned to admin")
      }
      return resErrorOccured(res, "Error Occured")
    }
    return resFound(res, "No new pages added")
  } catch (error) {
    return resServerError(res, error)
  }
}

function caps(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const rolesAssignedDefault = async (req, res) => {
  try {
    let interArr = await assignDefaultFunction() 
    let promise = await Promise.all(interArr)
    if (promise) return resDocUpdated(res, promise)
    return resErrorOccured(res, "Error Occured")
  } catch (error) {
    return resServerError(res, error)
  }
}

const assignDefaultFunction=async()=>{
  try {
    let interArr = []
    let pages = await page.findAll()
    let roles = await db.roles.findAll()
    pages.forEach((p) => {
      roles.forEach(async (r) => {
        let inter = await db.rolePages.findOne({
          where: {
            roleId: r.Id,
            pageId: p.Id
          }
        })
        if (!inter) interArr.push(db.rolePages.create({
          roleId: r.Id,
          pageId: p.Id,
          isActive: 0
        }))
      })
    })
    return interArr
  } catch (error) {
    throw error
  }
}
const grantPagePermission = async (req, res) => {
  try {
    let { pageId, roleId } = req.query
    let body = pagePermissionBody(req.body)
    let pageRole = await db.rolePages.findOne({
      where: {
        pageId,
        roleId
      }
    })
    if (pageRole) {
      let grant = await pageRole.update(body)
      return resDocUpdated(res, grant)
    }
    return resErrorOccured(res, "Combination Unavailable")
  } catch (error) {
    return resServerError(res, error)
  }
}

function pagePermissionBody(body) {
  let updateBody = {
    isActive: body.isActive
  }
  return updateBody
}
module.exports = { assignDefaultFunction,addPages, assignPageRole, findAll, findById, updatePage, deletePage, findRoleByPageId, postAllPages, rolesAssignedDefault, grantPagePermission };
