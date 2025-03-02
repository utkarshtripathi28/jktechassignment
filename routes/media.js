const mediaController = require("../controllers/media");
const { upload } = require("../utils/uploadMiddleware");
const routes = require("express").Router();

routes.post("/addMedia", upload.single('file'), mediaController.addMedia);

routes.get("/findAllMedia", mediaController.findAll);

routes.get("/findById", mediaController.findById);

routes.put("/updateMedia", mediaController.updateMedia);

routes.post("/deleteMedia", mediaController.deleteMedia);

module.exports = routes;
