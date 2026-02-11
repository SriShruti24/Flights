const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

function validateCreateCityRequest(req, res, next) {
  if (!req.body ||!req.body.name) {
    ErrorResponse.message = "Something went wrong while creating city";
    ErrorResponse.error = new AppError(["Name is not found in the incoming request body"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}
module.exports = {
    validateCreateCityRequest,
}