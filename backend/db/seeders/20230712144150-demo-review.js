'use strict';
const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const reviews = [
      {
        spotId: 1,
        userId: 1,
        review: "I LOVED IT!!! This place was amazing!",
        stars: getRandomStars()
      },
      {
        spotId: 2,
        userId: 2,
        review: "Not the best, but it was okay.",
        stars: getRandomStars()
      },
      {
        spotId: 3,
        userId: 3,
        review: "Decent stay, would recommend.",
        stars: getRandomStars()
      }
    ];

    return Review.bulkCreate(reviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};

function getRandomStars() {
  return Math.floor(Math.random() * 5) + 1;
}
