'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Review } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';

    const review1 = await Review.findOne({
      where: {
        review: "Best place ever for Smash battles!"
      }
    });

    const review2 = await Review.findOne({
      where: {
        review: "Beautiful art gallery and lovely home."
      }
    });

    const review3 = await Review.findOne({
      where: {
        review: "Perfectly clean and pretty, but so clean and sterile that it's hard to feel at home."
      }
    });

    const review4 = await Review.findOne({
      where: {
        review: "Lovely, but easy to get lost in. Maybe post some signs in the hallways or something? I couldn't find my bedroom for over a day."
      }
    });

    const review5 = await Review.findOne({
      where: {
        review: "Very lovely. The perfect place to dispose of your...worries."
      }
    });

    await queryInterface.bulkInsert(options, [
      {
        reviewId: review1.id,
        url: 'https://your-image-link-here-1.jpg'
      },
      {
        reviewId: review2.id,
        url: 'https://your-image-link-here-2.jpg'
      },
      {
        reviewId: review3.id,
        url: 'https://your-image-link-here-3.jpg'
      },
      {
        reviewId: review4.id,
        url: 'https://your-image-link-here-4.jpg'
      },
      {
        reviewId: review5.id,
        url: 'https://your-image-link-here-5.jpg'
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        'https://your-image-link-here-1.jpg',
        'https://your-image-link-here-2.jpg',
        'https://your-image-link-here-3.jpg',
        'https://your-image-link-here-4.jpg',
        'https://your-image-link-here-5.jpg'
      ] }
    }, {});
  }
};
