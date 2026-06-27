const {StatusCodes}=require('http-status-codes');
const{FlightService}=require('../services');
const {ErrorResponse, SuccessResponse, SocketEmitter}=require('../utils/common');

async function createFlight(req, res){
    try {
        const flight = await FlightService.createFlight({
            flightNumber:req.body.flightNumber,
            airplaneId:req.body.airplaneId,
            departureAirportId:req.body.departureAirportId,
            arrivalAirportId:req.body.arrivalAirportId,
            departureTime:req.body.departureTime,
            arrivalTime:req.body.arrivalTime,
            price:req.body.price,
            boardingGate:req.body.boardingGate,
            totalSeats:req.body.totalSeats
        });
        SuccessResponse.data = flight;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function getAllFlights(req, res){
    try {
        const flights = await FlightService.getAllFlights(req.query);
        SuccessResponse.data = flights;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function getFlight(req, res){
    try {
        const flight= await FlightService.getFlight(req.params.id);
        SuccessResponse.data = flight;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function updateSeats(req,res){
    try{
        const response =await FlightService.updateSeats({
            flightId: req.params.id,
            seats:req.body.seats,
            dec:req.body.dec
        });
        SuccessResponse.data = response;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error = error;
        return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

async function getSeats(req, res) {
    try {
        const seats = await FlightService.getSeatsForFlight(req.params.id);
        SuccessResponse.data = seats;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function holdSeats(req, res) {
    try {
        const seats = await FlightService.holdSeats(
            req.params.id,
            req.body.seatNumbers,
            req.body.holdBy
        );
        
        // Emit Socket update
        const io = SocketEmitter.getIo();
        if (io) {
            io.to(req.params.id.toString()).emit('seatStatusUpdated', {
                flightId: req.params.id,
                seatNumbers: req.body.seatNumbers,
                status: 'HOLD',
                holdBy: req.body.holdBy,
                holdUntil: seats[0]?.holdUntil
            });
        }

        SuccessResponse.data = seats;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function releaseSeats(req, res) {
    try {
        const result = await FlightService.releaseSeats(
            req.params.id,
            req.body.seatNumbers,
            req.body.holdBy
        );
        
        // Emit Socket update
        const io = SocketEmitter.getIo();
        if (io) {
            io.to(req.params.id.toString()).emit('seatStatusUpdated', {
                flightId: req.params.id,
                seatNumbers: req.body.seatNumbers,
                status: 'AVAILABLE',
                holdBy: null,
                holdUntil: null
            });
        }

        SuccessResponse.data = result;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function confirmSeats(req, res) {
    try {
        const seats = await FlightService.confirmSeats(
            req.params.id,
            req.body.seatNumbers,
            req.body.holdBy
        );
        
        // Emit Socket update
        const io = SocketEmitter.getIo();
        if (io) {
            io.to(req.params.id.toString()).emit('seatStatusUpdated', {
                flightId: req.params.id,
                seatNumbers: req.body.seatNumbers,
                status: 'BOOKED',
                holdBy: req.body.holdBy,
                holdUntil: null
            });
        }

        SuccessResponse.data = seats;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateSeats,
    getSeats,
    holdSeats,
    releaseSeats,
    confirmSeats
}