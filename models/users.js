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
          const randomId = utils.genrateUUI();
          return randomId;
        },
        primaryKey: true,
      },
      firstName: DataTypes.STRING(50),
      lastName: DataTypes.STRING(50),
      dateOfBirth: DataTypes.DATEONLY,
      username: DataTypes.STRING(50),
      emailAddress: DataTypes.STRING(100),
      keyCloakUserId: DataTypes.STRING(50),
      isPasswordSet: DataTypes.BOOLEAN,
      contactNumber: DataTypes.STRING(12),
      altContactNumber: DataTypes.STRING(12),
      roleId: DataTypes.STRING(15),
      accountId: DataTypes.STRING(15),
      organizationId: DataTypes.STRING(15),
      isActive: DataTypes.BOOLEAN,
      addLine1: DataTypes.STRING(50),
      addLine2: DataTypes.STRING(50),
      city: DataTypes.STRING(50),
      pincode: DataTypes.STRING(6),
      state: DataTypes.STRING(50),
      gstNumber: DataTypes.STRING(50),
      merchantKey: { type: DataTypes.STRING(30) },
      merchantSalt: { type: DataTypes.STRING(50) },
      createdBy: { type: DataTypes.STRING(50) },
      updatedBy: { type: DataTypes.STRING(50) },
      isExternal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,},
      vendorsId:{type: DataTypes.STRING(15)},
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
