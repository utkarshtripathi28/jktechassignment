const mediaController = require("../controllers/media");
const { upload } = require("../utils/uploadMiddleware");
const routes = require("express").Router();
const {verifyToken} = require('../utils/jwt');

routes.post("/addMedia", upload.single('file'),verifyToken, mediaController.addMedia);

routes.get("/findAllMedia",verifyToken, mediaController.findAll);

routes.get("/findById",verifyToken, mediaController.findById);

routes.put("/updateMedia",verifyToken, mediaController.updateMedia);

routes.post("/deleteMedia",verifyToken, mediaController.deleteMedia);

module.exports = routes;
