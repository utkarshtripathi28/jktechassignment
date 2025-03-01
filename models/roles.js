"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  roles.init(
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
      name: DataTypes.STRING(30),
      isActive: DataTypes.BOOLEAN,
      description: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "roles",
      timestamps:true
    }
  );
  return roles;
};
