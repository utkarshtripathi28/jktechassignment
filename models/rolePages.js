"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class rolePages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rolePages.init(
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
      pageId: { type: DataTypes.STRING(15) },
      roleId: { type: DataTypes.STRING(15) },
      isActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "rolePages",
      timestamps:true
    }
  );
  return rolePages;
};
