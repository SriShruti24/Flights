const { City, Airport } = require('../models');
const { Op } = require('sequelize');

class SearchRepository {
    async getCities(query) {
        const cities = await City.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { state: { [Op.like]: `%${query}%` } }
                ]
            },
            limit: 10
        });
        return cities;
    }

    async getAirports(query) {
        const airports = await Airport.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { code: { [Op.like]: `%${query}%` } },
                    { '$City.name$': { [Op.like]: `%${query}%` } }
                ]
            },
            include: [
                {
                    model: City,
                    required: false
                }
            ],
            limit: 10
        });
        return airports;
    }
}

module.exports = SearchRepository;
