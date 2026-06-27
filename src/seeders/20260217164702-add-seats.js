'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const airplanes = await queryInterface.sequelize.query(
      "SELECT id FROM Airplanes LIMIT 1"
    );
    const airplaneId = airplanes[0][0].id;
    
    const seats = [];
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
      for(let row = 1; row <= 10; row++) {
        seats.push({
          airplaneId: airplaneId,
          row: row,
          col: col,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    });

    await queryInterface.bulkInsert("Seats", seats);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
