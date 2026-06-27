'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // No-op: Flight seats are now created dynamically when flights are added.
    return Promise.resolve();
  },

  async down (queryInterface, Sequelize) {
    return Promise.resolve();
  }
};
