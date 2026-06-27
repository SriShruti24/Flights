'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // No-op to prevent duplicate inserts during sequential seeding
  },

  async down (queryInterface, Sequelize) {
    // No-op
  }
};
