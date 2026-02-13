const {StatusCodes}=require('http-status-codes');
const{AirportService}=require('../services');

const {ErrorResponse, SuccessResponse}=require('../utils/common');

/*
POST -> /airports -> createAirports
request body -> {name:'IGI',cityId:5,code:'DEL'}
 */
async function createAirport(req, res){
    try {
        const airport = await AirportService.createAirport({
           name:req.body.name,
           code:req.body.code,
           address:req.body.address,
           cityId:req.body.cityId
        });
        SuccessResponse.data = airport;
        return res
        .status(StatusCodes.CREATED)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
/*
Get -> /airports
request body ->{}
 */
async function getAirports(req, res){
    try {
        const airport = await AirportService.getAirports();
        SuccessResponse.data = airport;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
/*
Get -> /airport/:id
request body ->{}
 */
async function getAirport(req, res){
    try {
        const airport = await AirportService.getAirport(req.params.id);
        SuccessResponse.data = airport;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
/*
DELETE -> /airport/:id -> getAirport
request body ->{}
 */
async function destroyAirport(req, res){
    try {
        const airport = await AirportService.destroyAirport(req.params.id);
        SuccessResponse.data = airport;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}
async function updateAirport(req, res){
    try {
        const airport = await AirportService.updateAirport(req.params.id, req.body);
        SuccessResponse.data = airport;
        return res
        .status(StatusCodes.OK)
        .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode)
        .json(ErrorResponse);
    }
}


module.exports = {
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
}