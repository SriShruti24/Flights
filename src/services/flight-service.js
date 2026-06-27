const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const { FlightRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { compareTimes } = require("../utils/helpers/datetime-helpers");
const db = require("../models");
const { Queue } = require("../config");

const flightRepository = new FlightRepository();

async function createFlight(data) {
  const transaction = await db.sequelize.transaction();
  try {
    // validation: arrival must be AFTER departure
    if (!compareTimes(data.arrivalTime, data.departureTime)) {
      throw new AppError(
        ["Arrival time must be greater than departure time"],
        StatusCodes.BAD_REQUEST,
      );
    }
    
    // Fetch airplane capacity
    const airplane = await db.Airplane.findByPk(data.airplaneId, { transaction });
    if (!airplane) {
      throw new AppError("No airplane found for the given ID", StatusCodes.BAD_REQUEST);
    }

    // Create the flight
    const flight = await db.flight.create(data, { transaction });

    // Generate seats based on airplane capacity
    const capacity = airplane.capacity;
    const seats = [];
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatsPerRow = cols.length; // 6
    const totalRows = Math.ceil(capacity / seatsPerRow);

    let seatsCreated = 0;
    for (let row = 1; row <= totalRows && seatsCreated < capacity; row++) {
      for (let colIndex = 0; colIndex < seatsPerRow && seatsCreated < capacity; colIndex++) {
        const col = cols[colIndex];
        
        let seatClass = 'ECONOMY';
        let baseMultiplier = 1.0;
        if (row <= 2) {
          seatClass = 'BUSINESS';
          baseMultiplier = 2.0;
        } else if (row <= 4) {
          seatClass = 'PREMIUM_ECONOMY';
          baseMultiplier = 1.3;
        }

        let seatType = 'MIDDLE';
        let typeMultiplier = 0;
        if (row === 5) { // Exit row / Extra Legroom
          seatType = 'EXTRA_LEG_ROOM';
          typeMultiplier = 0.2;
        } else if (col === 'A' || col === 'F') {
          seatType = 'WINDOW';
          typeMultiplier = 0.1;
        } else if (col === 'C' || col === 'D') {
          seatType = 'AISLE';
          typeMultiplier = 0.05;
        }

        const fareMultiplier = parseFloat((baseMultiplier + typeMultiplier).toFixed(2));
        
        seats.push({
          flightId: flight.id,
          seatNumber: `${row}${col}`,
          seatClass,
          seatType,
          status: 'AVAILABLE',
          fareMultiplier,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        seatsCreated++;
      }
    }

    await db.Seat.bulkCreate(seats, { transaction });

    await transaction.commit();
    return flight;
  } catch (error) {
    await transaction.rollback();
    if (error.name == "SequelizeValidationError") {
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
      "Cannot create a flight object",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getAllFlights(query) {
  let customerFilters = {};
  let sortFilter= [];
  const endingTriptime = "23:59:00";
  //trips=MUM_DEL
  if (query.trips) {
    const [departureAirportId, arrivalAirportId] = query.trips.split("-");
    // check if both airports are same
    if (departureAirportId === arrivalAirportId) {
      throw new AppError(
        ["Departure and arrival airports cannot be the same"],
        StatusCodes.BAD_REQUEST,
      );
    }
    customerFilters.departureAirportId = departureAirportId;
    customerFilters.arrivalAirportId = arrivalAirportId;
  }
  if (query.price) {
    [minPrice, maxPrice] = query.price.split("-");
    customerFilters.price = {
      [Op.between]: [
        minPrice,
        maxPrice == undefined ? Number.MAX_VALUE : maxPrice,
      ],
    };
  }
  if (query.travellers) {
    customerFilters.totalSeats = {
      [Op.gte]: query.travellers,
    };
  }
  if(query.tripDate){
    customerFilters.departureTime={
        [Op.between]: [query.tripDate, query.tripDate + " " + endingTriptime]
    };
  }
  if(query.sort){
    const params=query.sort.split(',');
    const sortFilters=params.map((param)=> param.split('_'));
    sortFilter=sortFilters;
  }
  try {
    const flights = await flightRepository.getAllFlights(customerFilters);
    return flights;
  } catch (error) {
    throw new AppError(
      "Cannot fetch data of all the flights",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}

async function getFlight(id){
  try{
    const flight=await flightRepository.get(id);
    return flight;
  } catch(error){
    if(error.statusCode == StatusCodes.NOT_FOUND){
        throw new AppError('The flight you requested is not found',error.statusCode);
    }
    throw new AppError('Cannot fetch an flight with given id', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function updateSeats(data){
  try{
    const response=await flightRepository.updateRemainingSeats(data.flightId,data.seats,data.dec);
    return response;
  }catch(error){
    console.log(error);
    throw new AppError('Cannot update data of the flight', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getSeatsForFlight(flightId) {
  try {
    const seats = await db.Seat.findAll({
      where: { flightId },
      order: [
        ['id', 'ASC']
      ]
    });
    return seats;
  } catch (error) {
    throw new AppError("Cannot retrieve seats for the flight", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function holdSeats(flightId, seatNumbers, holdBy) {
  const transaction = await db.sequelize.transaction();
  try {
    const now = new Date();
    // Query seats with row lock
    const seats = await db.Seat.findAll({
      where: {
        flightId,
        seatNumber: {
          [Op.in]: seatNumbers
        }
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (seats.length !== seatNumbers.length) {
      throw new AppError("One or more requested seats do not exist for this flight", StatusCodes.NOT_FOUND);
    }

    const holdUntil = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes hold

    for (const seat of seats) {
      const isAvailable = seat.status === 'AVAILABLE' || 
                          (seat.status === 'HOLD' && seat.holdUntil < now) ||
                          (seat.status === 'HOLD' && seat.holdBy === holdBy);

      if (!isAvailable) {
        throw new AppError(`Seat ${seat.seatNumber} is not available for booking`, StatusCodes.CONFLICT);
      }

      seat.status = 'HOLD';
      seat.holdBy = holdBy;
      seat.holdUntil = holdUntil;
      await seat.save({ transaction });
    }

    await transaction.commit();

    // Publish event
    await Queue.publishEvent('seat.hold.created', {
      flightId,
      seatNumbers,
      holdBy,
      holdUntil
    });

    return seats;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to hold seats", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function releaseSeats(flightId, seatNumbers, holdBy) {
  const transaction = await db.sequelize.transaction();
  try {
    const seats = await db.Seat.findAll({
      where: {
        flightId,
        seatNumber: {
          [Op.in]: seatNumbers
        }
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    let releasedCount = 0;
    for (const seat of seats) {
      if (seat.status === 'HOLD' && seat.holdBy === holdBy) {
        seat.status = 'AVAILABLE';
        seat.holdBy = null;
        seat.holdUntil = null;
        await seat.save({ transaction });
        releasedCount++;
      }
    }

    await transaction.commit();

    if (releasedCount > 0) {
      // Publish event
      await Queue.publishEvent('seat.released', {
        flightId,
        seatNumbers,
        holdBy
      });
    }

    return true;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to release seats", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function confirmSeats(flightId, seatNumbers, holdBy) {
  const transaction = await db.sequelize.transaction();
  try {
    const seats = await db.Seat.findAll({
      where: {
        flightId,
        seatNumber: {
          [Op.in]: seatNumbers
        }
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (seats.length !== seatNumbers.length) {
      throw new AppError("One or more seats could not be found", StatusCodes.NOT_FOUND);
    }

    for (const seat of seats) {
      const now = new Date();
      if (seat.status !== 'HOLD' || seat.holdBy !== holdBy || (seat.holdUntil && seat.holdUntil < now)) {
        throw new AppError(`Seat ${seat.seatNumber} hold has expired or is invalid`, StatusCodes.CONFLICT);
      }

      seat.status = 'BOOKED';
      await seat.save({ transaction });
    }

    await transaction.commit();

    // Publish event
    await Queue.publishEvent('seat.booked', {
      flightId,
      seatNumbers,
      holdBy
    });

    return seats;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof AppError) throw error;
    throw new AppError(error.message || "Failed to confirm seats", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateSeats,
  getSeatsForFlight,
  holdSeats,
  releaseSeats,
  confirmSeats
};
