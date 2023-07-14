'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const reviewImages = [
      {
        reviewId: 1,
        url: "image1.jpg"
      },
      {
        reviewId: 2,
        url: "image2.jpg"
      },
      {
        reviewId: 3,
        url: "image3.jpg"
      }
    ];

    return ReviewImage.bulkCreate(reviewImages, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
