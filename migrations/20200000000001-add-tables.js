"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("users", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      name: Sequelize.STRING(50),
      username: {type: Sequelize.STRING(30),allowNull: false},
      dateOfBirth: Sequelize.DATEONLY,
      emailAddress: Sequelize.STRING(100),
      contactNumber: Sequelize.STRING(12),
      password: Sequelize.STRING(100),
      roleId: Sequelize.STRING(15),
      isActive: Sequelize.BOOLEAN,
      address: Sequelize.STRING(50),
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

    await queryInterface.createTable("apiEndPoints", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      name: Sequelize.STRING(100),
      apiEndPoint: Sequelize.STRING(100),
      description: Sequelize.STRING(255),
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
    await queryInterface.dropTable("apiEndPoints");
    await queryInterface.dropTable("apiEndPointRoles");
  },
};
