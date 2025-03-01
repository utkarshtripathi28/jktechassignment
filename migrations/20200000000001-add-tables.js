"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable("bestPractices", {
      id: { type: Sequelize.STRING(15), allowNull: false, primaryKey: true },
      title: Sequelize.STRING(200),
      mediaId: Sequelize.STRING(15),
      language: Sequelize.STRING(15),
      views: { defaultValue: 0, type: Sequelize.INTEGER },
      bpId: { type: Sequelize.INTEGER },
      componentsId: { type: Sequelize.STRING(15) },
      publishedDate: { type: Sequelize.DATEONLY },
      bpPositionId: { type: Sequelize.INTEGER },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    });
    
     //indexing of zevs
    await queryInterface.addIndex("zevs", ["mediaId"], {
      name: "zevs_z1",
    });

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
