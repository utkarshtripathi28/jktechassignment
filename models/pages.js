"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class pages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pages.init(
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
      name: DataTypes.STRING(100),
      displayName: DataTypes.STRING(100),
      route: DataTypes.STRING(100),
      isActive: { type: DataTypes.BOOLEAN, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: "pages",
      timestamps:true
    }
  );
  return pages;
};
