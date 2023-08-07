'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { User } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
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
        address: "1 Cosmic Vista",
        city: "World of Illusion",
        state: "Dream Land",
        country: "Nintendo World",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "Final Destination",
        description: "A mystical realm suspended in space, where the boundary between dreams and reality blurs. The ethereal landscape shifts with the emotions of the fighters, creating a stage that mirrors their inner strength and determination.",
        price: 500
      },
      {
        ownerId: user2.id,
        address: "2 Battlefield Peak",
        city: "Sky World",
        state: "Skyloft",
        country: "Nintendo World",
        lat: 45.7645358,
        lng: -321.4730327,
        name: "Battlefield",
        description: "Perched high above the clouds, this legendary floating island is the battleground where heroes from different dimensions collide. The three platforms offer tactical advantages and opportunities for daring aerial combat.",
        price: 150
      },
      {
        ownerId: user2.id,
        address: "3 Pokemon Avenue",
        city: "Poke City",
        state: "Kanto",
        country: "Nintendo World",
        lat: 45.7645358,
        lng: -321.4730327,
        name: "Pokemon Stadium 2",
        description: "A state-of-the-art arena where Pokemon Trainers gather to showcase their beloved companions' unique skills. The stadium transforms its terrain to various Pokemon types, influencing the dynamics of the battle.",
        price: 600
      },
      {
        ownerId: user3.id,
        address: "4 Whimsical Wonders",
        city: "Dream Land",
        state: "Popstar",
        country: "Nintendo World",
        lat: 50.7645358,
        lng: -400.4730327,
        name: "Dream Land",
        description: "A fantastical kingdom where pink, fluffy landscapes abound. The serene environment welcomes friendly brawls and is the homeland of the iconic Kirby, who often joins the fray to share his unique abilities.",
        price: 800
      },
      {
        ownerId: user4.id,
        address: "5 Enchanted Glade",
        city: "Dream Land",
        state: "Popstar",
        country: "Nintendo World",
        lat: 23.7645358,
        lng: -700.4730327,
        name: "Fountain of Dreams",
        description: "An enchanting glade where the mystical Fountain of Dreams stands. The soothing melodies of past battles play here, inspiring warriors to show their prowess while they bask in the serene ambiance.",
        price: 300
      },
      {
        ownerId: user4.id,
        address: "6 Triforce Keep",
        city: "Hyrule Castle Town",
        state: "Hyrule",
        country: "Nintendo World",
        lat: 23.7645358,
        lng: -700.4730327,
        name: "Hyrule Castle",
        description: "The iconic castle from the Legend of Zelda series, imbued with history and secrets. Its battlefield features a central tower and familiar landmarks, a stage fitting for champions seeking legendary glory.",
        price: 300
      },
      {
        ownerId: user5.id,
        address: "7 Starfox Avenue",
        city: "Lylat System",
        state: "Lylat",
        country: "Nintendo World",
        lat: 45.7645358,
        lng: -300.4730327,
        name: "Lylat",
        description: "A futuristic space station orbiting the Lylat System. Fighter pilots from various corners of the galaxy gather here for thrilling dogfights, using the platforms for strategic maneuvers and fast-paced battles.",
        price: 123
      },
      {
        ownerId: user6.id,
        address: "8 Village Square",
        city: "Smashville",
        state: "Nintendo Land",
        country: "Nintendo World",
        lat: 45.7645358,
        lng: -300.4730327,
        name: "Smashville",
        description: "A charming village square that hosts lively Smash Bros tournaments. The friendly villagers cheer on the fighters, creating a welcoming atmosphere for epic battles and unforgettable memories.",
        price: 666
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Final Destination', 'Battlefield', 'Pokemon Stadium 2', 'Dream Land', 'Fountain of Dreams', 'Hyrule Castle', 'Lylat', 'Smashville'] }
    }, {});
  }
};
