'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-09-03')
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date('2023-09-05'),
        endDate: new Date('2023-09-08')
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date('2032-09-10'),
        endDate: new Date('2032-09-15')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
