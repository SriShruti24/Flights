const { StatusCodes } = require('http-status-codes');
const {AirportRepository}= require('../repositories');
const AppError = require('../utils/errors/app-error');


const airportRepository = new AirportRepository();

async function createAirport(data){
    try {
        const airport = await airportRepository.create(data);
        return airport;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create an airport object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirports(){
    try{
        const airports=await airportRepository.getAll();
        return airports;
    } catch(error){
        throw new AppError('Cannot fetch data of all the airports', StatusCodes.NOT_FOUND);
    }
}
async function getAirport(id){
    try{
        const airports=await airportRepository.get(id);
        return airports;
    } catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The airport you requested is not found',error.statusCode);
        }
        throw new AppError('Cannot fetch an airport with given id', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function destroyAirport(id){
    try{
        const response=await airportRepository.destroy(id);
        if(response == 0){
            throw new AppError('The airport you requested to delete is not found', StatusCodes.NOT_FOUND);
        }
        return response;
    } catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The airport you requested to delete is not found',error.statusCode);
        }
        throw new AppError('Cannot delete an airport with given id', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function updateAirport(id, data){
    try{
        const response=await airportRepository.update(id, data);
        if(response[0] == 0){
            throw new AppError('The airport you requested to update is not found', StatusCodes.NOT_FOUND);
        }
        return response;
    } catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The airport you requested to update is not found',error.statusCode);
        }
        throw new AppError('Cannot update an airport with given id', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports = {
    createAirport,
    getAirports,
    getAirport,
    destroyAirport,
    updateAirport
}