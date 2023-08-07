'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Spot, User, Booking } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';

    const user1 = await User.findOne({ where: { firstName: 'Nick' } });
    const user2 = await User.findOne({ where: { firstName: 'Grace' } });
    const user3 = await User.findOne({ where: { firstName: 'Toni' } });
    const user4 = await User.findOne({ where: { firstName: 'Tom' } });
    const user5 = await User.findOne({ where: { firstName: 'Authy' } });

    const spot1 = await Spot.findOne({ where: { address: "1 Cosmic Vista" } });
    const spot2 = await Spot.findOne({ where: { address: "2 Battlefield Peak" } });
    const spot3 = await Spot.findOne({ where: { address: "8 Village Square" } });
    const spot4 = await Spot.findOne({ where: { address: "5 Enchanted Glade" } });
    const spot5 = await Spot.findOne({ where: { address: "7 Starfox Avenue" } });

    await queryInterface.bulkInsert(options, [
      { spotId: spot1.id, userId: user2.id, startDate: "2023-07-30", endDate: '2023-08-06' },
      { spotId: spot2.id, userId: user3.id, startDate: "2023-08-01", endDate: '2023-08-04' },
      { spotId: spot3.id, userId: user4.id, startDate: "2023-08-02", endDate: '2023-08-06' },
      { spotId: spot4.id, userId: user5.id, startDate: "2023-07-25", endDate: '2023-08-01' },
      { spotId: spot5.id, userId: user1.id, startDate: "2023-07-16", endDate: '2023-07-20' }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: ['2023-07-30', '2023-08-01', '2023-08-02', '2023-07-25', '2023-07-16'] }
    }, {});
  }
};
