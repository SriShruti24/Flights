const { StatusCodes } = require('http-status-codes');
const { SearchService } = require('../services');
const { ErrorResponse, SuccessResponse } = require('../utils/common');
const searchService = new SearchService();

async function searchCities(req, res) {
    try {
        const query = req.query.q || '';
        const suggestions = await searchService.searchCities(query);
        SuccessResponse.data = suggestions;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res
            .status(statusCode)
            .json(ErrorResponse);
    }
}

async function searchAirports(req, res) {
    try {
        const query = req.query.q || '';
        const suggestions = await searchService.searchAirports(query);
        SuccessResponse.data = suggestions;
        return res
            .status(StatusCodes.OK)
            .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        return res
            .status(statusCode)
            .json(ErrorResponse);
    }
}

module.exports = {
    searchCities,
    searchAirports
};
