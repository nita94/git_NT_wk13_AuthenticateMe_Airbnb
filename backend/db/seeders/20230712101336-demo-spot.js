'use strict';
const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const spots = [
      {
        ownerId: 1,
        address: "123 Oak Street",
        city: "Austin",
        state: "Texas",
        country: "United States of America",
        lat: 30.2672,
        lng: -97.7431,
        name: "Modern Loft in Downtown Austin",
        description: "Experience the vibrant city life of Austin in this stylish modern loft.",
        price: 200,
      },
      {
        ownerId: 2,
        address: "456 Main Avenue",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.7604,
        lng: -95.3698,
        name: "Luxury Penthouse with City Views",
        description: "Indulge in luxury and enjoy breathtaking views of Houston's skyline from this penthouse.",
        price: 300,
      },
      {
        ownerId: 3,
        address: "789 Elm Street",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 32.7767,
        lng: -96.7970,
        name: "Spacious Family Home in Dallas",
        description: "Make unforgettable memories with your family in this spacious and comfortable home.",
        price: 250,
      },
    ];

    return Spot.bulkCreate(spots, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
