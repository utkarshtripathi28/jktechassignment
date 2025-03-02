const db = require("../models");

module.exports = async (req, userId) => {
    try {
        let body = {
            name: req.file.filename,
            path: req.file.path,
            comments: req.body.comments,
            size: req.file.size,
            identifierId: req.query.Id,
            createdBy: userId
        }
        let mediaDoc = await db.media.create(body);
        if (mediaDoc) return { data: mediaDoc, error: null }
        return { data: null, error: "Error uploading media!!" };
    } catch (error) {
        throw error
    }
}