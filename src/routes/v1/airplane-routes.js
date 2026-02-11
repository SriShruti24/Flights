const express=require('express');
const { AirplaneController }=require('../../controllers');
const { AirplaneMiddlewares }=require('../../middleware');

const router=express.Router();


// /api/v1/airplanes POST
router.post('/',
    AirplaneMiddlewares.validateCreateAirplaneRequest,
    AirplaneController.createAirplane);
// /api/v1/airplanes GET
router.get('/',
    AirplaneController.getAirplanes);
// /api/v1/airplanes/:id GET
router.get('/:id',
    AirplaneController.getAirplane);


module.exports=router;