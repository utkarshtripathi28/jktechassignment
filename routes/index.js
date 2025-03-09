let router = {};

router.users = require("./users");
router.roles = require("./roles");
router.apiEndPoints = require("./apiEndPoints");
router.media = require("./media");
router.auth = require("./authRoutes");
router.ingestion = require("./ingestionApi");

module.exports = router;
