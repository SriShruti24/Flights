const { StatusCodes } = require('http-status-codes');
const {AirplaneRepository}= require('../repositories');
const AppError = require('../utils/errors/app-error');


const airplaneRepository = new AirplaneRepository();

async function createAirplane(data){
    try {
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        if(error.name == 'SequelizeValidationError'){
            let explanation = [];
            error.errors.forEach((err)=>{
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot create an airplane object', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes(){
    try{
        const airplanes=await airplaneRepository.getAll();
        return airplanes;
    } catch(error){
        throw new AppError('Cannot fetch data of all the airplanes', StatusCodes.NOT_FOUND);
    }
}
async function getAirplane(id){
    try{
        const airplanes=await airplaneRepository.get(id);
        return airplanes;
    } catch(error){
        if(error.statusCode == StatusCodes.NOT_FOUND){
            throw new AppError('The airplane you requested is not found',error.statusCode);
        }
        throw new AppError('Cannot fetch an airplane with given id', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    createAirplane,
    getAirplanes,
    getAirplane
}