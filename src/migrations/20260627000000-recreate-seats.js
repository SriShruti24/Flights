'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop Seats if it exists to clean up old airplaneId scheme
    await queryInterface.dropTable('Seats', { force: true }).catch(() => {});
    
    await queryInterface.createTable('Seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'flights',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      seatNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      seatClass: {
        type: Sequelize.ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST_CLASS'),
        allowNull: false,
        defaultValue: 'ECONOMY'
      },
      seatType: {
        type: Sequelize.ENUM('WINDOW', 'AISLE', 'MIDDLE', 'EXTRA_LEG_ROOM'),
        allowNull: false,
        defaultValue: 'MIDDLE'
      },
      status: {
        type: Sequelize.ENUM('AVAILABLE', 'HOLD', 'BOOKED', 'BLOCKED', 'CHECKED_IN'),
        allowNull: false,
        defaultValue: 'AVAILABLE'
      },
      holdBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      holdUntil: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fareMultiplier: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1.00
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Seats');
  }
};
