const express=require('express');
const { CityController }=require('../../controllers');
const { CityMiddlewares }=require('../../middleware');
const router=express.Router();


// /api/v1/City POST
router.post('/',
    CityMiddlewares.validateCreateCityRequest,
    CityController.createCity);

module.exports=router;