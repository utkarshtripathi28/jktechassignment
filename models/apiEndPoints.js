"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class apiEndPoints extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apiEndPoints.init(
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
      apiEndPoint: DataTypes.STRING(100),
      description: DataTypes.STRING(255),
      pageId: { type: DataTypes.STRING(15) },
    },
    {
      sequelize,
      modelName: "apiEndPoints",
      timestamps:true
    }
  );
  return apiEndPoints;
};
