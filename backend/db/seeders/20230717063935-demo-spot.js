'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "789 Beach Avenue",
        city: "Los Angeles",
        state: "California",
        country: "USA",
        lat: 34.052235,
        lng: -118.243683,
        name: "Sunset Retreat",
        description: "Enjoy beautiful sunsets",
        price: 129.99
      },
      {
        ownerId: 2,
        address: "321 Mountain View",
        city: "Seattle",
        state: "Washington",
        country: "USA",
        lat: 47.606209,
        lng: -122.332071,
        name: "Nature Haven",
        description: "Surrounded by breathtaking views",
        price: 89.50
      },
      {
        ownerId: 3,
        address: "456 Lakefront Road",
        city: "Chicago",
        state: "Illinois",
        country: "USA",
        lat: 41.878113,
        lng: -87.629799,
        name: "Urban Oasis",
        description: "Experience city life at its best",
        price: 179.00
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options);
  }
};
