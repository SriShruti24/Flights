const {StatusCodes}=require('http-status-codes');
const{FlightService}=require('../services');
const {ErrorResponse, SuccessResponse}=require('../utils/common');

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
        // Prevent browser from caching seat availability — stale 304s break real-time polling
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.set('Pragma', 'no-cache');
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
        SuccessResponse.data = seats;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        // Send the real error message (not just the hardcoded 'Something went wrong')
        // Include conflict flag so the frontend knows to immediately refresh and deselect
        const isConflict = (error.statusCode === StatusCodes.CONFLICT);
        return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'Failed to hold seats',
            conflict: isConflict,
            error: error,
        });
    }
}

async function releaseSeats(req, res) {
    try {
        const result = await FlightService.releaseSeats(
            req.params.id,
            req.body.seatNumbers,
            req.body.holdBy
        );
        


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