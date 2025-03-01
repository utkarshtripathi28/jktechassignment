"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class apiEndPointRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apiEndPointRoles.init(
    {
      Id: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: () => {
          const randomId = utils.generateUUI();
          return randomId;
        },
        primaryKey: true,
      },
      apiEndPointId: { type: DataTypes.STRING(15) },
      roleId: { type: DataTypes.STRING(15) },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "apiEndPointRoles",
      timestamps:true
    }
  );
  return apiEndPointRoles;
};
