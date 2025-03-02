"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  media.init(
    {
      Id: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: () => {
          const randomId = utils.genrateUUI();
          return randomId;
        },
        primaryKey: true,
      },
      name: DataTypes.STRING(150),
      path: DataTypes.STRING(250),
      comments: DataTypes.STRING(100),
      size: DataTypes.INTEGER(11),
      url: DataTypes.STRING(255),
      identifierId: DataTypes.STRING(15),
      createdBy: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "media",
    }
  );
  return media;
};
