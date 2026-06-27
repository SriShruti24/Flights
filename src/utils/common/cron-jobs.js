const cron = require('node-cron');
const { Seat } = require('../../models');
const { Op } = require('sequelize');
const { Queue } = require('../../config');


function scheduleCrons() {
    cron.schedule('*/1 * * * *', async () => {
        try {
            console.log("Running automatic seat release cron job...");
            const now = new Date();
            const expiredSeats = await Seat.findAll({
                where: {
                    status: 'HOLD',
                    holdUntil: {
                        [Op.lt]: now
                    }
                }
            });

            if (expiredSeats.length > 0) {
                console.log(`Found ${expiredSeats.length} expired seats. Releasing...`);
                for (const seat of expiredSeats) {
                    const transaction = await Seat.sequelize.transaction();
                    try {
                        const lockedSeat = await Seat.findByPk(seat.id, {
                            transaction,
                            lock: transaction.LOCK.UPDATE
                        });
                        
                        if (lockedSeat && lockedSeat.status === 'HOLD' && lockedSeat.holdUntil < now) {
                            const oldHoldBy = lockedSeat.holdBy;
                            lockedSeat.status = 'AVAILABLE';
                            lockedSeat.holdBy = null;
                            lockedSeat.holdUntil = null;
                            await lockedSeat.save({ transaction });

                            await transaction.commit();

                            await Queue.publishEvent('seat.hold.expired', {
                                seatId: lockedSeat.id,
                                flightId: lockedSeat.flightId,
                                seatNumber: lockedSeat.seatNumber,
                                holdBy: oldHoldBy
                            });



                            console.log(`Released seat ${lockedSeat.seatNumber} for flight ${lockedSeat.flightId} (held by ${oldHoldBy})`);
                        } else {
                            await transaction.rollback();
                        }
                    } catch (error) {
                        await transaction.rollback();
                        console.error(`Error releasing seat ${seat.id} in transaction:`, error);
                    }
                }
            }
        } catch (error) {
            console.error("Error in automatic seat release cron job:", error);
        }
    });
}

module.exports = scheduleCrons;
