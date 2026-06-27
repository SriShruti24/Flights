'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const airplanes = [
      { id: 1, modelNumber: 'Airbus A320', capacity: 60, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, modelNumber: 'Airbus A321', capacity: 60, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, modelNumber: 'Airbus A350', capacity: 90, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, modelNumber: 'Boeing 737', capacity: 60, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, modelNumber: 'Boeing 737 MAX', capacity: 60, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, modelNumber: 'Boeing 777', capacity: 120, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, modelNumber: 'Boeing 787', capacity: 90, createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Airplanes', airplanes, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airplanes', null, {});
  }
};
