'use strict';
const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const spotImages = [
      {
        spotId: 1,
        url: "/images/bathroom.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "/images/livingroom.jpg",
        preview: true
      },
      {
        spotId: 3,
        url: "/images/masterroom.jpg",
        preview: true
      }
    ];

    return SpotImage.bulkCreate(spotImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
