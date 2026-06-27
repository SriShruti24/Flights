'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Cities', 'state', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Cities', 'country', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'India'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cities', 'state');
    await queryInterface.removeColumn('Cities', 'country');
  }
};
