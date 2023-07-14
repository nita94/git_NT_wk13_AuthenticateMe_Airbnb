'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Main Street",
        city: "Houston",
        state: "Texas",
        country: "United States of America",
        lat: 29.7604,
        lng: -95.3698,
        name: "Texas Modern Retreat",
        description: "Experience the best of Texas with this modern retreat located in the heart of Houston.",
        price: 123,
      },
      {
        ownerId: 2,
        address: "456 Elm Street",
        city: "Austin",
        state: "Texas",
        country: "United States of America",
        lat: 30.2672,
        lng: -97.7431,
        name: "Hill Country Cabin",
        description: "Escape to the beautiful Hill Country with this cozy cabin nestled in nature's embrace.",
        price: 322,
      },
      {
        ownerId: 3,
        address: "789 Oak Street",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 32.7767,
        lng: -96.7970,
        name: "Luxury High-Rise Condo",
        description: "Indulge in luxury living at this high-rise condo offering breathtaking views of the Dallas skyline.",
        price: 1776,
      },
      {
        ownerId: 4,
        address: "101 Pine Street",
        city: "San Antonio",
        state: "Texas",
        country: "United States of America",
        lat: 29.4241,
        lng: -98.4936,
        name: "Historic Spanish Villa",
        description: "Step back in time and experience the charm of this historic Spanish villa in the heart of San Antonio.",
        price: 849,
      },
      {
        ownerId: 5,
        address: "202 Cedar Street",
        city: "Fort Worth",
        state: "Texas",
        country: "United States of America",
        lat: 32.7555,
        lng: -97.3308,
        name: "Texas Ranch Retreat",
        description: "Immerse yourself in the Texas ranch lifestyle with this serene retreat surrounded by natural beauty.",
        price: 623,
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
