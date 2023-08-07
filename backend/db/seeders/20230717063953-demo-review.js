'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { User, Spot } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';

    const user1 = await User.findOne({ where: { firstName: 'Nick' } });
    const user2 = await User.findOne({ where: { firstName: 'Grace' } });
    const user3 = await User.findOne({ where: { firstName: 'Toni' } });
    const user4 = await User.findOne({ where: { firstName: 'Tom' } });
    const user5 = await User.findOne({ where: { firstName: 'Authy' } });
    const user6 = await User.findOne({ where: { firstName: 'Demo' } });

    const spot1 = await Spot.findOne({ where: { address: "1 Cosmic Vista" } });
    const spot2 = await Spot.findOne({ where: { address: "2 Battlefield Peak" } });
    const spot3 = await Spot.findOne({ where: { address: "3 Pokemon Avenue" } });
    const spot4 = await Spot.findOne({ where: { address: "4 Whimsical Wonders" } });
    const spot5 = await Spot.findOne({ where: { address: "5 Enchanted Glade" } });
    const spot6 = await Spot.findOne({ where: { address: "6 Triforce Keep" } });
    const spot7 = await Spot.findOne({ where: { address: "7 Starfox Avenue" } });
    const spot8 = await Spot.findOne({ where: { address: "8 Village Square" } });

    await queryInterface.bulkInsert(options, [
      { spotId: spot1.id, userId: user5.id, review: "Best place ever for Smash battles!", stars: 5 },
      { spotId: spot1.id, userId: user3.id, review: "Super cozy and fun. Perfect for a Smash Bros party.", stars: 4 },
      { spotId: spot2.id, userId: user4.id, review: "Beautiful spot, great setups for gaming.", stars: 5 },
      { spotId: spot2.id, userId: user1.id, review: "Love the gaming-themed decor, but the chairs are a bit uncomfortable.", stars: 4 },
      { spotId: spot3.id, userId: user6.id, review: "The perfect place for a competitive gaming tournament.", stars: 5 },
      { spotId: spot3.id, userId: user4.id, review: "Spacious and great setups, but the eerie vibe can be distracting.", stars: 3 },
      { spotId: spot4.id, userId: user3.id, review: "Perfect spot to get away from the world. Like, really far away.", stars: 5 },
      { spotId: spot4.id, userId: user2.id, review: "Lovely, but easy to get lost in. Maybe post some signs in the hallways or something? I couldn't find my bedroom for over a day.", stars: 3 },
      { spotId: spot5.id, userId: user2.id, review: "Beautiful art gallery and lovely home.", stars: 5 },
      { spotId: spot5.id, userId: user2.id, review: "Perfectly clean and pretty, but so clean and sterile that it's hard to feel at home.", stars: 4 },
      { spotId: spot6.id, userId: user5.id, review: "Very lovely. The perfect place to dispose of your...worries.", stars: 5 },
      { spotId: spot6.id, userId: user4.id, review: "The cabin is definitely haunted. Pretty sure there are bodies in the lake.", stars: 2 },
      { spotId: spot7.id, userId: user2.id, review: "A perfect spa getaway for gamers to relax after intense battles.", stars: 5 },
      { spotId: spot7.id, userId: user3.id, review: "Beautiful place. Plan to come back in the future. My only complaint is the lack of food. Just because I'm at a spa doesn't mean I'm on a diet.", stars: 4 },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: {
        [Op.in]: [
          'Best place ever for Smash battles!',
          'Super cozy and fun. Perfect for a Smash Bros party.',
          'Beautiful spot, great setups for gaming.',
          'Love the gaming-themed decor, but the chairs are a bit uncomfortable.',
          'The perfect place for a competitive gaming tournament.',
          'Spacious and great setups, but the eerie vibe can be distracting.',
          'Perfect spot to get away from the world. Like, really far away.',
          'Lovely, but easy to get lost in. Maybe post some signs in the hallways or something? I couldn’t find my bedroom for over a day.',
          'Beautiful art gallery and lovely home.',
          "Perfectly clean and pretty, but so clean and sterile that it's hard to feel at home.",
          'Very lovely. The perfect place to dispose of your...worries.',
          'The cabin is definitely haunted. Pretty sure there are bodies in the lake.',
          'A perfect spa getaway for gamers to relax after intense battles.',
          "Beautiful place. Plan to come back in the future. My only complaint is the lack of food. Just because I'm at a spa doesn't mean I'm on a diet."
        ]
      }
    }, {});
  }
};
