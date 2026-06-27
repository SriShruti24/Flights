const dotenv = require('dotenv');
dotenv.config();

module.exports={
    PORT:process.env.PORT,
    RABBITMQ_URL:process.env.RABBITMQ_URL
}