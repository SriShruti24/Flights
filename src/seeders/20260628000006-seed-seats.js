'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch all flights to map seats up to aircraft capacity
    const flights = await queryInterface.sequelize.query(
      "SELECT id, totalSeats FROM flights;",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!flights || flights.length === 0) {
      console.warn("No flights found to seed seats for!");
      return;
    }

    const seatsToInsert = [];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    let seatIndex = 0;

    for (const flight of flights) {
      const totalSeats = flight.totalSeats;
      const numRows = Math.ceil(totalSeats / 6);

      for (let row = 1; row <= numRows; row++) {
        for (let colIdx = 0; colIdx < 6; colIdx++) {
          const colLetter = cols[colIdx];
          const seatNumber = `${row}${colLetter}`;

          // Seat Class selection
          let seatClass = 'ECONOMY';
          let fareMultiplier = 1.0;
          if (row <= 2) {
            seatClass = 'BUSINESS';
            fareMultiplier = 2.0;
          } else if (row <= 4) {
            seatClass = 'PREMIUM_ECONOMY';
            fareMultiplier = 1.3;
          }

          // Seat Type selection
          let seatType = 'MIDDLE';
          let adjustment = 0.0;

          if (row === 5) {
            seatType = 'EXTRA_LEG_ROOM';
            adjustment = 0.20;
          } else {
            if (colLetter === 'A' || colLetter === 'F') {
              seatType = 'WINDOW';
              adjustment = 0.10;
            } else if (colLetter === 'C' || colLetter === 'D') {
              seatType = 'AISLE';
              adjustment = 0.05;
            }
          }

          const finalMultiplier = parseFloat((fareMultiplier + adjustment).toFixed(2));

          // Distribution: 95% AVAILABLE, 3% BOOKED, 2% BLOCKED
          let status = 'AVAILABLE';
          const distVal = seatIndex % 100;
          if (distVal < 2) {
            status = 'BLOCKED';
          } else if (distVal < 5) {
            status = 'BOOKED';
          }

          seatsToInsert.push({
            flightId: flight.id,
            seatNumber,
            seatClass,
            seatType,
            status,
            holdBy: null,
            holdUntil: null,
            fareMultiplier: finalMultiplier,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          seatIndex++;
        }
      }
    }

    // Insert in batches of 2000 to keep it optimized
    const batchSize = 2000;
    for (let i = 0; i < seatsToInsert.length; i += batchSize) {
      const batch = seatsToInsert.slice(i, i + batchSize);
      await queryInterface.bulkInsert('Seats', batch);
    }

    console.log(`Successfully seeded ${seatsToInsert.length} seats across ${flights.length} flights.`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Seats', null, {});
  }
};
