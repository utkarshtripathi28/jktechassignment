"use strict";
const { Model } = require("sequelize");
const utils = require("../utils/generateUniqueId");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  users.init(
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
      name: DataTypes.STRING(50),
      username: {type: DataTypes.STRING(30),allowNull: false},
      dateOfBirth: DataTypes.DATEONLY,
      emailAddress: DataTypes.STRING(100),
      contactNumber: DataTypes.STRING(12),
      password: DataTypes.STRING(100),
      roleId: DataTypes.STRING(15),
      isActive: DataTypes.BOOLEAN,
      address: DataTypes.STRING(50),
      city: DataTypes.STRING(50),
      pincode: DataTypes.INTEGER(6),
      state: DataTypes.STRING(50),
    },
    {
      sequelize,
      modelName: "users",
      timestamps:true
    }
  );
  return users;
};
