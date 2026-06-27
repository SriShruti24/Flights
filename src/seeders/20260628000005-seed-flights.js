'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const airports = ['DEL', 'BOM', 'BLR', 'HYD', 'AMD', 'MAA', 'CCU', 'PNQ', 'JAI', 'LKO', 'VNS', 'SXR', 'GOP', 'ATQ', 'IXR'];
    const flights = [];
    let flightCount = 1;

    for (let i = 0; i < airports.length; i++) {
      for (let j = 0; j < airports.length; j++) {
        if (i === j) continue;
        if (flightCount > 105) break;

        const depAirport = airports[i];
        const arrAirport = airports[j];
        
        const flightNumber = `BM-${1000 + flightCount}`;
        const airplaneId = (flightCount % 7) + 1;
        
        const capacities = { 1: 60, 2: 60, 3: 90, 4: 60, 5: 60, 6: 120, 7: 90 };
        const totalSeats = capacities[airplaneId];

        // Departure time ranges between today and the next 5 days
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() + (flightCount % 5));
        baseDate.setHours(6 + (flightCount % 12), (flightCount % 4) * 15, 0, 0);

        const departureTime = new Date(baseDate);
        
        const durationHours = 1 + (flightCount % 3);
        const arrivalTime = new Date(departureTime);
        arrivalTime.setHours(arrivalTime.getHours() + durationHours);

        const price = 50 + (flightCount % 15) * 10; 

        flights.push({
          id: flightCount,
          flightNumber,
          airplaneId,
          departureAirportId: depAirport,
          arrivalAirportId: arrAirport,
          departureTime,
          arrivalTime,
          price,
          boardingGate: `G-${1 + (flightCount % 20)}`,
          totalSeats,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        flightCount++;
      }
    }

    await queryInterface.bulkInsert('flights', flights, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('flights', null, {});
  }
};
