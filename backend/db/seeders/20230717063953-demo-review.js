'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { User, Spot } = require('../models');

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';

    const user1 = await User.findOne({ where: { firstName: 'Nick' } });
    const user2 = await User.findOne({ where: { firstName: 'Grace' } });
    const user3 = await User.findOne({ where: { firstName: 'Toni' } });
    const user4 = await User.findOne({ where: { firstName: 'Tom' } });
    const user5 = await User.findOne({ where: { firstName: 'Authy' } });
    const user6 = await User.findOne({ where: { firstName: 'Demo' } });

    const spot1 = await Spot.findOne({ where: { address: "123 Disney Lane" } });
    const spot2 = await Spot.findOne({ where: { address: "1010 Fake Street" } });
    const spot3 = await Spot.findOne({ where: { address: "2020 Volkihar Street" } });
    const spot4 = await Spot.findOne({ where: { address: "5600 Castle Terrace" } });
    const spot5 = await Spot.findOne({ where: { address: "5050 Artists Lane" } });
    const spot6 = await Spot.findOne({ where: { address: "5050 Lakeside Road" } });
    const spot7 = await Spot.findOne({ where: { address: "6060 Beauty Way" } });
    const spot8 = await Spot.findOne({ where: { address: "666 Volt Way" } });

    await queryInterface.bulkInsert(options, [
      { spotId: spot1.id, userId: user5.id, review: "Best place ever!", stars: 5 },
      { spotId: spot1.id, userId: user3.id, review: "Super cozy and relaxing. Perfect vacation spot.", stars: 4 },
      { spotId: spot2.id, userId: user4.id, review: "Beautiful place, amazing accomodations.", stars: 5 },
      { spotId: spot2.id, userId: user1.id, review: "Love the modern minimalist design. Beds are a bit uncomfortable, though.", stars: 4 },
      { spotId: spot3.id, userId: user6.id, review: "I LOVE the creepy atmosphere and beautiful designs.", stars: 5 },
      { spotId: spot3.id, userId: user4.id, review: "It's super spacious and lovely, but kinda creepy. Pretty sure a ghost stole my amulet.", stars: 3 },
      { spotId: spot4.id, userId: user3.id, review: "Perfect spot to get away from the world. Like, really far away.", stars: 5 },
      { spotId: spot4.id, userId: user2.id, review: "Lovely, but easy to get lost in. Maybe post some signs in the hallways or something? I couldnt find my bedroom for over a day.", stars: 3 },
      { spotId: spot5.id, userId: user2.id, review: "Beautiful art gallery and lovely home.", stars: 5 },
      { spotId: spot5.id, userId: user2.id, review: "Perfecly clean and pretty, but so clean and sterile that it's hard to feel at-home.", stars: 4 },
      { spotId: spot6.id, userId: user5.id, review: "Very lovely. Perfect place to dispose of your...worries.", stars: 5 },
      { spotId: spot6.id, userId: user4.id, review: "Cabin is definitely haunted. Pretty sure there are bodies in the lake.", stars: 2 },
      { spotId: spot7.id, userId: user2.id, review: "Perfect spa getaway. Would totally rate it higher if I could.", stars: 5 },
      { spotId: spot7.id, userId: user3.id, review: "Beautiful place. Plan to come back in the future. My only complaint is the lack of food. Just because Im at a spa doesn't mean Im on a diet.", stars: 4 },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: [
        'Best place ever!',
        'Super cozy and relaxing. Perfect vacation spot.',
        'Beautiful place, amazing accomodations.',
        'Love the modern minimalist design. Beds are a bit uncomfortable, though.',
        'I LOVE the creepy atmosphere and beautiful designs.',
        "It's super spacious and lovely, but kinda creepy. Pretty sure a ghost stole my amulet.",
        'Perfect spot to get away from the world. Like, really far away.',
        'Lovely, but easy to get lost in. Maybe post some signs in the hallways or something? I couldnt find my bedroom for over a day.',
        'Beautiful art gallery and lovely home.',
        "Perfecly clean and pretty, but so clean and sterile that it's hard to feel at-home.",
        'Very lovely. Perfect place to dispose of your...worries.',
        'Cabin is definitely haunted. Pretty sure there are bodies in the lake.',
        'Perfect spa getaway. Would totally rate it higher if I could.',
        "Beautiful place. Plan to come back in the future. My only complaint is the lack of food. Just because Im at a spa doesn't mean Im on a diet."
      ] }
    }, {});
  }
};
