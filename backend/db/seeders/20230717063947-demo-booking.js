'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: "2023-02-10",
        endDate: "2023-02-20"
      },
      {
        spotId: 2,
        userId: 2,
        startDate: "2023-07-01",
        endDate: "2023-07-10"
      },
      {
        spotId: 3,
        userId: 3,
        startDate: "2023-12-25",
        endDate: "2024-01-01"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options);
  }
};
