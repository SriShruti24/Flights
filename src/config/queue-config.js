const amqplib = require("amqplib");
const ServerConfig = require('./server-config');

let channel, connection;

async function connectQueue() {
    try {
        connection = await amqplib.connect(ServerConfig.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        // Assert the exchange for seat events
        await channel.assertExchange("seat-events-exchange", "topic", { durable: true });
        console.log("RabbitMQ connected in Flights Service, exchange asserted.");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ in Flights Service:", error);
    }
}

async function publishEvent(routingKey, data) {
    try {
        if (!channel) {
            console.warn("RabbitMQ channel not established, attempting to reconnect...");
            await connectQueue();
        }
        channel.publish("seat-events-exchange", routingKey, Buffer.from(JSON.stringify(data)));
        console.log(`Event published to exchange with routing key: ${routingKey}`);
    } catch (error) {
        console.error(`Failed to publish event ${routingKey}:`, error);
    }
}

module.exports = {
    connectQueue,
    publishEvent
};
