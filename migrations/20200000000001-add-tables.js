"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("users", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      firstName: Sequelize.STRING(30),
      lastName: Sequelize.STRING(30),
      dateOfBirth: Sequelize.DATEONLY,
      username: Sequelize.STRING(50),
      emailAddress: Sequelize.STRING(100),
      keyCloakUserId: Sequelize.STRING(50),
      contactNumber: Sequelize.STRING(12),
      altContactNumber: Sequelize.STRING(12),
      roleId: Sequelize.STRING(15),
      accountId: Sequelize.STRING(15),
      isActive: Sequelize.BOOLEAN,
      addLine1: Sequelize.STRING(50),
      addLine2: Sequelize.STRING(50),
      city: Sequelize.STRING(50),
      pincode: Sequelize.INTEGER(6),
      state: Sequelize.STRING(50),
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable("roles", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      name: Sequelize.STRING(30),
      isActive: Sequelize.BOOLEAN,
      description: Sequelize.STRING(255),
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable("pages", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      name: Sequelize.STRING(100),
      displayName: Sequelize.STRING(100),
      route: Sequelize.STRING(100),
      isActive: { type: Sequelize.BOOLEAN, defaultValue: 1 },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable("rolePages", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      pageId: { type: Sequelize.STRING(15) },
      roleId: { type: Sequelize.STRING(15) },
      isActive: Sequelize.BOOLEAN,
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable("apiEndPoints", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      name: Sequelize.STRING(100),
      apiEndPoint: Sequelize.STRING(100),
      description: Sequelize.STRING(255),
      pageId: { type: Sequelize.STRING(15) },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });

    await queryInterface.createTable("apiEndPointRoles", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      apiEndPointId: { type: Sequelize.STRING(15) },
      roleId: { type: Sequelize.STRING(15) },
      isActive: Sequelize.BOOLEAN,
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
    await queryInterface.dropTable("pages");
    await queryInterface.dropTable("rolePages");
    await queryInterface.dropTable("apiEndPoints");
    await queryInterface.dropTable("apiEndPointRoles");
  },
};
