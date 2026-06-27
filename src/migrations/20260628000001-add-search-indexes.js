'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Cities', ['name'], {
      name: 'cities_name_idx'
    });
    await queryInterface.addIndex('Airports', ['name'], {
      name: 'airports_name_idx'
    });
    await queryInterface.addIndex('Airports', ['code'], {
      name: 'airports_code_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Cities', 'cities_name_idx');
    await queryInterface.removeIndex('Airports', 'airports_name_idx');
    await queryInterface.removeIndex('Airports', 'airports_code_idx');
  }
};
