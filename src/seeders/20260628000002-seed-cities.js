'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const cities = [
      { id: 1, name: 'Mumbai', state: 'Maharashtra', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Delhi', state: 'Delhi', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Bangalore', state: 'Karnataka', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Hyderabad', state: 'Telangana', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Ahmedabad', state: 'Gujarat', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Chennai', state: 'Tamil Nadu', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Kolkata', state: 'West Bengal', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Pune', state: 'Maharashtra', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Jaipur', state: 'Rajasthan', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 11, name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 12, name: 'Nagpur', state: 'Maharashtra', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 13, name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 14, name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 15, name: 'Patna', state: 'Bihar', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 16, name: 'Vadodara', state: 'Gujarat', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 17, name: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 18, name: 'Ludhiana', state: 'Punjab', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 19, name: 'Agra', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 20, name: 'Nashik', state: 'Maharashtra', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 21, name: 'Faridabad', state: 'Haryana', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 22, name: 'Meerut', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 23, name: 'Rajkot', state: 'Gujarat', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 24, name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 25, name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 26, name: 'Gorakhpur', state: 'Uttar Pradesh', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 27, name: 'Amritsar', state: 'Punjab', country: 'India', createdAt: new Date(), updatedAt: new Date() },
      { id: 28, name: 'Ranchi', state: 'Jharkhand', country: 'India', createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Cities', cities, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cities', null, {});
  }
};
