const express=require('express');
const { FlightController }=require('../../controllers');
const { FlightMiddlewares }=require('../../middleware');

const router=express.Router();

// /api/v1/flights POST
router.post('/',
    FlightMiddlewares.validateCreateFlightRequest,
    FlightController.createFlight);

// /api/v1/flights?trips=MUM-DEL GET
router.get('/',
    FlightController.getAllFlights);

// /api/v1/flights/:id GET
router.get('/:id',FlightController.getFlight);

// /api/v1/flights/:id/seats PATCH
router.patch('/:id/seats',FlightMiddlewares.validateUpdateSeatsRequest,FlightController.updateSeats);

// Seat booking APIs
router.get('/:id/seats', FlightController.getSeats);
router.post('/:id/seats/hold', FlightController.holdSeats);
router.post('/:id/seats/release', FlightController.releaseSeats);
router.post('/:id/seats/confirm', FlightController.confirmSeats);

module.exports=router;