'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const airports = ['DEL', 'BOM', 'BLR', 'HYD', 'AMD', 'MAA', 'CCU', 'PNQ', 'JAI', 'LKO', 'VNS', 'SXR', 'GOP', 'ATQ', 'IXR'];
    const flights = [];
    let flightCount = 1;

    // INR base prices by duration bucket
    // 1h  → ₹1,400 – ₹4,500
    // 2h  → ₹3,800 – ₹10,000
    // 3h  → ₹7,500 – ₹20,000
    const inrPriceTiers = {
      1: [1400, 1800, 2200, 2600, 3000, 3500, 4000, 4500],
      2: [3800, 4500, 5200, 6000, 6800, 7500, 8500, 10000],
      3: [7500, 9000, 10500, 12000, 14000, 16000, 18000, 20000],
    };

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
        
        const durationHours = 1 + (flightCount % 3);   // 1, 2, or 3 hours
        const arrivalTime = new Date(departureTime);
        arrivalTime.setHours(arrivalTime.getHours() + durationHours);

        // Pick price from tier table — use (i + j) as a deterministic offset per route pair
        const tier = inrPriceTiers[durationHours];
        const price = tier[(i + j) % tier.length];

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
