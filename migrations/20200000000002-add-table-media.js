"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("media", {
      Id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      name: Sequelize.STRING(150),
      path: Sequelize.STRING(250),
      comments: Sequelize.STRING(100),
      size: Sequelize.INTEGER(11),
      url: Sequelize.STRING(255),
      identifierId: Sequelize.STRING(15),
      createdBy: Sequelize.STRING(15),
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("media");
  },
};
