'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 3,
        review: "Had a fantastic experience! I felt completely safe during my stay.",
        stars: 4
      },
      {
        userId: 2,
        spotId: 1,
        review: "Although the place wasn't the best, I'm willing to give it another chance next year. Hopefully, improvements will be made.",
        stars: 3
      },
      {
        userId: 3,
        spotId: 2,
        review: "I had an absolutely amazing stay! I would highly recommend this place to any of my friends. The experience was truly memorable.",
        stars: 5
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
