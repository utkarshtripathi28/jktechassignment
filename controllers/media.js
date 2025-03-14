const db = require("../models");

const media = db.media;
const { resServerError, resDocCreated, resDocUpdated, resFound, resDocDeleted, resErrorOccured } = require("../utils/response");
const uploadMedia = require("../utils/uploadMedia");

const addMedia = async (req, res) => {
  try {
    if (!req.file) return resErrorOccured(res, "No files uploaded!!")
    let mediaU = await uploadMedia(req, req.user.Id)
    if (mediaU.error != null) return resErrorOccured(res, mediaU.error)
    return resDocCreated(res, mediaU.data);
  } catch (error) {
    return resServerError(res, error);
  }
};

const findAll = async (req, res) => {
  try {
    const docs = await media.findAll({
      order: [
        ["createdAt", "DESC"],
        ["updatedAt", "DESC"]
      ],
    });
    return resFound(res, docs);

  } catch (error) {
    return resServerError(res, error);
  }
};

const findById = async (req, res) => {
  try {
    let { Id } = req.query;
    const mediaDoc = await media.findAll({
      where: { Id: Id }
    });
    return resFound(res, mediaDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};

const updateMedia = async (req, res) => {
  try {
    const { Id } = req.query;
    const isRecordUpdated = await media.update(req.body, { where: { Id: Id } });
    if (isRecordUpdated > 0) {
      let response = await media.findOne({ where: { Id: Id } });
      return resDocUpdated(res, response);
    } else {
      return resErrorOccured(res, "Record not found")
    }
  } catch (error) {
    return resServerError(res, error);
  }
};

const deleteMedia = async (req, res) => {
  try {
    const { Id } = req.query;
    let mediaDoc = await media.destroy({ where: { Id } });
    return resDocDeleted(res, mediaDoc);
  } catch (error) {
    return resServerError(res, error);
  }
};


module.exports = { addMedia, findAll, findById, updateMedia, deleteMedia };
