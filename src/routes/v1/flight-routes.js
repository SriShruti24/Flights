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

module.exports=router;