'use strict';
const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          startDate: "09/01/2023",
          endDate: "09/03/2023",
        },
        {
          spotId: 2,
          userId: 2,
          startDate: "09/05/2023",
          endDate: "09/08/2023",
        },
        {
          spotId: 3,
          userId: 3,
          startDate: "09/10/2023",
          endDate: "09/12/2023",
        }
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
