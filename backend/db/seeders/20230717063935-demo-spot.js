'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { User } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';

    const user1 = await User.findOne({ where: { firstName: 'Nick' } });
    const user2 = await User.findOne({ where: { firstName: 'Grace' } });
    const user3 = await User.findOne({ where: { firstName: 'Toni' } });
    const user4 = await User.findOne({ where: { firstName: 'Tom' } });
    const user5 = await User.findOne({ where: { firstName: 'Authy' } });
    const user6 = await User.findOne({ where: { firstName: 'Demo' } });

    await queryInterface.bulkInsert(options, [
      {
        ownerId: user1.id,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Castle Dour",
        description: "A seaside castle with beautiful sunsets and gloomy, rainy days.",
        price: 500
      },
      {
        ownerId: user2.id,
        address: "1010 Fake Street",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 45.7645358,
        lng: -321.4730327,
        name: "Minimalist Clubhouse",
        description: "A calming paradise that's just the right size.",
        price: 150
      },
      {
        ownerId: user2.id,
        address: "2020 Volkihar Street",
        city: "Coomhola",
        state: "County Cork",
        country: "Ireland",
        lat: 45.7645358,
        lng: -321.4730327,
        name: "Castle Volkihar",
        description: "May or may not be inhabited by vampires.",
        price: 600
      },
      {
        ownerId: user3.id,
        address: "5600 Castle Terrace",
        city: "Vik",
        state: "Sogn og Fjordane",
        country: "Norway",
        lat: 50.7645358,
        lng: -400.4730327,
        name: "Scenic Refurbished Castle",
        description: "The perfect place for both eccentric villainy and harmless seclusion.",
        price: 800
      },
      {
        ownerId: user4.id,
        address: "5050 Artists Lane",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 23.7645358,
        lng: -700.4730327,
        name: "Dallas Art Palace",
        description: "A spacious home with a built-in art gallery.",
        price: 300
      },
      {
        ownerId: user4.id,
        address: "5050 Lakeside Road",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 23.7645358,
        lng: -700.4730327,
        name: "Lakeside Cabin",
        description: "A luxurious cabin miles from any disturbances. Has access to a dock with multiple kayaks for guests to use.",
        price: 300
      },
      {
        ownerId: user5.id,
        address: "6060 Beauty Way",
        city: "Dallas",
        state: "Texas",
        country: "United States of America",
        lat: 45.7645358,
        lng: -300.4730327,
        name: "Countryside Spa Getaway",
        description: "A beautiful getaway in the middle of nowhere. Includes a spa area, outdoor courtyard, and a four-wheeler for outdoor exploration.",
        price: 123
      },
      {
        ownerId: user6.id,
        address: "666 Volt Way",
        city: "Camhoola",
        state: "County Cork",
        country: "Ireland",
        lat: 45.7645358,
        lng: -300.4730327,
        name: "Draculas Hideout",
        description: "A castle with questionable history. Dont worry, we replaced all the with tile that wont stain.",
        price: 666
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Castle Dour', 'Minimalist Clubhouse', 'Castle Volkihar', 'Scenic Refurbished Castle', 'Dallas Art Palace', 'Lakeside Cabin', 'Countryside Spa Getaway', 'Draculas Hideout'] }
    }, {});
  }
};
