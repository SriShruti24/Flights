const express=require('express');
const { FlightController }=require('../../controllers');
const { FlightMiddlewares }=require('../../middleware');

const router=express.Router();


// /api/v1/flights POST
router.post('/',
    FlightMiddlewares.validateCreateFlightRequest,
    FlightController.createFlight);

module.exports=router;