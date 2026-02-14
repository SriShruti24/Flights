const { StatusCodes } = require('http-status-codes');
const {FlightRepository}= require('../repositories');
const AppError = require('../utils/errors/app-error');
const { compareTimes } = require('../utils/helpers/datetime-helpers');

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {

    // validation: arrival must be AFTER departure
    if (!compareTimes(data.arrivalTime, data.departureTime)) {
      throw new AppError(
        ['Arrival time must be greater than departure time'],
        StatusCodes.BAD_REQUEST
      );
    }

    const flight = await flightRepository.create(data);
    return flight;

  } catch (error) {

    if (error.name == 'SequelizeValidationError') {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });

      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      'Cannot create a flight object',
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createFlight,
};
