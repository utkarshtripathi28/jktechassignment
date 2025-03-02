const jwt = require("jsonwebtoken");
let path = require("path");
const { validateUserAccess } = require("/validateUserAccess");
let config_file = path.join(__dirname, "../config/dbConfig.js");
let config=require(config_file);
const JWT_SECRET = config.JWT_SECRET;
let EXPIRES_IN = config.EXPIRES_IN;
let getToken = async (userData) => {
  return jwt.sign({ userData }, JWT_SECRET, { expiresIn: EXPIRES_IN });
};
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ status: 403, error: err.message, msg: "" });
      } else {
        req.user = decodedToken.userData;
        console.log("req.originalUrl.split", req.originalUrl.split("?")[0]);
        let isValid = await validateUserAccess(req.user.type, req.user.code, req.originalUrl.split("?")[0],req.method);
        if (isValid.doc==false){
          return res.status(401).json({ status: 401, statusMessage: "You don't have permission to access this API", error: "invalid-access" });
        }
        next();
      }
    });
  } else {
    return res.status(401).json({ status: 401, error: "Authentication token is missing or invalid!" });
  }
};
const verifyDownloadToken = (token) => {
  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      throw err.message;
    } else {
      let user = jwt.decode(token);

      return user.userData;
    }
  });
};

module.exports = {
  verifyToken,
  getToken,
  verifyDownloadToken
};
