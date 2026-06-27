'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const airports = [
      { name: 'Chhatrapati Shivaji Maharaj International Airport', code: 'BOM', address: 'Sahar, Andheri East, Mumbai', cityId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Indira Gandhi International Airport', code: 'DEL', address: 'Palam, New Delhi', cityId: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kempegowda International Airport', code: 'BLR', address: 'Devanahalli, Bengaluru', cityId: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rajiv Gandhi International Airport', code: 'HYD', address: 'Shamshabad, Hyderabad', cityId: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sardar Vallabhbhai Patel International Airport', code: 'AMD', address: 'Hansol, Ahmedabad', cityId: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chennai International Airport', code: 'MAA', address: 'Meenambakkam, Chennai', cityId: 6, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Netaji Subhash Chandra Bose International Airport', code: 'CCU', address: 'Dum Dum, Kolkata', cityId: 7, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pune Airport', code: 'PNQ', address: 'Lohegaon, Pune', cityId: 8, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jaipur International Airport', code: 'JAI', address: 'Sanganer, Jaipur', cityId: 9, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Chaudhary Charan Singh International Airport', code: 'LKO', address: 'Amausi, Lucknow', cityId: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Kanpur Airport', code: 'KNU', address: 'Chakeri, Kanpur', cityId: 11, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dr. Babasaheb Ambedkar International Airport', code: 'NAG', address: 'Sonegaon, Nagpur', cityId: 12, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Visakhapatnam Airport', code: 'VTZ', address: 'NAD Post, Visakhapatnam', cityId: 13, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Raja Bhoj Airport', code: 'BHO', address: 'Gandhi Nagar, Bhopal', cityId: 14, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Jay Prakash Narayan Airport', code: 'PAT', address: 'Shaheed Pir Ali Khan Marg, Patna', cityId: 15, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Civil Airport Harni', code: 'BDQ', address: 'Harni Road, Vadodara', cityId: 16, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Hindon Airport', code: 'HDO', address: 'Ghaziabad, Uttar Pradesh', cityId: 17, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sahnewal Airport', code: 'LUH', address: 'Ludhiana, Punjab', cityId: 18, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pandit Deen Dayal Upadhyay Airport', code: 'AGR', address: 'Cantonment, Agra', cityId: 19, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Nashik Airport', code: 'ISK', address: 'Ozar, Nashik', cityId: 20, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Faridabad Heliport', code: 'FRD', address: 'Faridabad, Haryana', cityId: 21, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Dr. Ambedkar Airstrip', code: 'MTE', address: 'Meerut, Uttar Pradesh', cityId: 22, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Rajkot Airport', code: 'RAJ', address: 'Gandhi Ghar, Rajkot', cityId: 23, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lal Bahadur Shastri International Airport', code: 'VNS', address: 'Babatpur, Varanasi', cityId: 24, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Srinagar International Airport', code: 'SXR', address: 'Srinagar, Jammu & Kashmir', cityId: 25, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gorakhpur Airport', code: 'GOP', address: 'Gorakhpur, Uttar Pradesh', cityId: 26, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sri Guru Ram Dass Jee International Airport', code: 'ATQ', address: 'Rajasansi, Amritsar', cityId: 27, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Birsa Munda Airport', code: 'IXR', address: 'Hinoo, Ranchi', cityId: 28, createdAt: new Date(), updatedAt: new Date() }
    ];
    await queryInterface.bulkInsert('Airports', airports, { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Airports', null, {});
  }
};
