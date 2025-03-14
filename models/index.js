"use strict";
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const basename = path.basename(__filename);
const db = {};
const env = 'local';
const config = require(path.join(__dirname + "../../config/config.js"))[env];
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
sequelize
  .authenticate()
  .then(() => {
    console.log("JKTech db connected..");
  })
  .catch((err) => {
    console.log(err);
  });
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users = require("./users")(sequelize, DataTypes);
db.apiEndpointRoles = require("./apiEndpointRoles")(sequelize, DataTypes);
db.apiEndpoints = require("./apiEndpoints")(sequelize, DataTypes);
db.roles = require("./roles")(sequelize, DataTypes);
db.media = require("./media")(sequelize, DataTypes);


db.roles.hasMany(db.users,{
  foreignKey:'roleId',
  as:"users"
})

db.users.belongsTo(db.roles,{
  foreignKey:'roleId',
  as:"roles"
})

db.apiEndpoints.belongsToMany(db.roles, { through: db.apiEndpointRoles, foreignKey: 'apiEndpointId', as:'roles' });
db.roles.belongsToMany(db.apiEndpoints, { through: db.apiEndpointRoles, foreignKey: 'roleId', as:'apiEndpoints'});


module.exports = db;
