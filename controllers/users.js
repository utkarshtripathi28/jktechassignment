const db = require("../models");
const users = db.users;
const {
  resServerError,
  resDocCreated,
  resDocUpdated,
  resFound,
  resDocDeleted,
  resPaginationDoc,
  resErrorOccured,
} = require("../utils/response");
const { paginate } = require("../utils/pagination");
const { Op, Sequelize } = require("sequelize");

const addUsers = async (req, res) => {
  try {
    if (!req.body.username) return resErrorOccured(res, "username Missing !!");
    let uniqueNumber = await db.users.findAll({
      where: {
        username: req.body.username,
      },
    });
    if (uniqueNumber.length > 0)
      return resErrorOccured(res, "User with this username already exists!!");
    if (!req.body.emailAddress) return resErrorOccured(res, "email Missing !!");
    if (!req.body.roleId) return resErrorOccured(res, "role Missing !!");
    if (!req.body.contactNumber){
      return resErrorOccured(res, "contact Number Missing !!");
    }
    if (!req.body.firstName){
      return resErrorOccured(res, "first name Missing !!");
    }
    const numberRegex = /^(\+\d{1,3})?\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!numberRegex.test(req.body.contactNumber)) {
      return resErrorOccured(res, "Invalid contact number format");
    }
    if (req.body.altContactNumber) {
      if (!numberRegex.test(req.body.altContactNumber))
        return resErrorOccured(res, "Invalid alternate contact number format");
    }
    if (req.body.dateOfBirth) {
      if (!dateRegex.test(req.body.dateOfBirth)) {
        return resErrorOccured(res, "Date format should be YYYY-MM-DD");
      }
    }
    if (!emailRegex.test(req.body.emailAddress)) {
      return resErrorOccured(res, "Invalid email format");
    }
    if(req.body.isActive === undefined){
      req.body.isActive = 1;
    }
    let usersDoc = await users.create(req.body);
    if (usersDoc) return resDocCreated(res, usersDoc);
    return resErrorOccured(res, "Unable to add User");
  } catch (error) {
    return resServerError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    const searchQuery = req.query.searchQuery;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 10;
    let where = {};
    if (searchQuery && searchQuery !== "All") {
      where[Sequelize.Op.or] = [
        { username: { [Sequelize.Op.like]: `%${searchQuery}%` } },
        { contactNumber: { [Op.like]: `%${searchQuery}%` } },
        { altContactNumber: { [Op.like]: `%${searchQuery}%` } },
      ];
    }
    const { count, rows } = await users.findAndCountAll({
      offset: (page - 1) * limit,
      limit: limit,
      distinct: true,
      where: where,
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["Id", "name"],
          include: [
            {
              model: db.apiEndPoints,
              as: "apiEndPoints",
              attributes: [
                "Id",
                "name",
                "apiEndPoint",
                "description",
                "pageId",
              ],
            }
          ],
        },
        {
          model: db.media,
          as: "media",
        }
      ],
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
    const usersDoc = await users.findAll({
      where: { Id: id },
      include: [
        {
          model: db.roles,
          as: "role",
        },
        {
          model: db.media,
          as: "media",
        },
      ],
    });
    return resFound(res, usersDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.query;
    await db.users.findOne({ where: { Id: id } });

    console.log("updateUser req", req);
    const isRecordUpdated = await users.update(req.body, { where: { Id: id } });
    if (isRecordUpdated > 0) {
      let response = await users.findOne({ where: { Id: id } });
      console.log("updateUser if response", response);
      return resDocUpdated(res, response);
    } else {
      res.status(500).send({
        statusCode: "404",
        statusMessage: "Record not found",
      });
      console.log("updateUser else response", res);
    }
  } catch (error) {
    console.log("updateUser error", error);
    return resServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    let usersDoc = await users.destroy({ where: { Id: id } });
    return resDocDeleted(res, usersDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};


module.exports = {
  addUsers,
  findAll,
  findById,
  updateUser,
  deleteUser,
};
