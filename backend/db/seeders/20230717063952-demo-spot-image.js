'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Spot } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';

    const spot1 = await Spot.findOne({
      where: {
        address: "1 Cosmic Vista"
      }
    });

    const spot2 = await Spot.findOne({
      where: {
        address: "2 Battlefield Peak"
      }
    });

    const spot3 = await Spot.findOne({
      where: {
        address: "3 Pokemon Avenue"
      }
    });

    const spot4 = await Spot.findOne({
      where: {
        address: "4 Whimsical Wonders"
      }
    });

    const spot5 = await Spot.findOne({
      where: {
        address: "5 Enchanted Glade"
      }
    });

    const spot6 = await Spot.findOne({
      where: {
        address: "6 Triforce Keep"
      }
    });

    const spot7 = await Spot.findOne({
      where: {
        address: "7 Starfox Avenue"
      }
    });

    const spot8 = await Spot.findOne({
      where: {
        address: "8 Village Square"
      }
    });

    await queryInterface.bulkDelete(options, {
      spotId: {
        [Sequelize.Op.in]: [spot1.id, spot2.id, spot3.id, spot4.id, spot5.id, spot6.id, spot7.id, spot8.id]
      }
    });

    await queryInterface.bulkInsert(options, [
      // Spot 1
      {
        spotId: spot1.id,
        url: "https://images.gamebanana.com/img/ss/mods/63fadb224a91b.jpg",
        preview: true
      },
      {
        spotId: spot1.id,
        url: "https://images.gamebanana.com/img/ss/mods/63fad9ca2fab6.jpg",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://images.gamebanana.com/img/ss/mods/63fad9d295315.jpg",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://images.gamebanana.com/img/ss/mods/63fad9df18c06.jpg",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://images.gamebanana.com/img/ss/mods/63fad9ea0bdc5.jpg",
        preview: false
      },

      // Spot 2
      {
        spotId: spot2.id,
        url: "https://images.gamebanana.com/img/ss/mods/61d0b94e33087.jpg",
        preview: true
      },
      {
        spotId: spot2.id,
        url: "https://images.gamebanana.com/img/ss/mods/61d0bb07c40ea.jpg",
        preview: false
      },
      {
        spotId: spot2.id,
        url: "https://images.gamebanana.com/img/ss/mods/61d0bb06763b2.jpg",
        preview: false
      },
      {
        spotId: spot2.id,
        url: "https://images.gamebanana.com/img/ss/mods/61d0bb068e624.jpg",
        preview: false
      },
      {
        spotId: spot2.id,
        url: "https://images.gamebanana.com/img/ss/mods/61d0bb074c611.jpg",
        preview: false
      },

      // Spot 3
      {
        spotId: spot3.id,
        url: "https://images.gamebanana.com/img/ss/mods/60de00ba3e9ef.jpg",
        preview: true
      },
      {
        spotId: spot3.id,
        url: "https://images.gamebanana.com/img/ss/mods/60de00c49a984.jpg",
        preview: false
      },
      {
        spotId: spot3.id,
        url: "https://images.gamebanana.com/img/ss/mods/60de00e48c656.jpg",
        preview: false
      },
      {
        spotId: spot3.id,
        url: "https://images.gamebanana.com/img/ss/mods/60df663362b76.jpg",
        preview: false
      },
      {
        spotId: spot3.id,
        url: "https://images.gamebanana.com/img/ss/mods/60df663c95685.jpg",
        preview: false
      },

      // Spot 4
      {
        spotId: spot4.id,
        url: "https://images.gamebanana.com/img/ss/mods/621cf51fabef3.jpg",
        preview: true
      },
      {
        spotId: spot4.id,
        url: "https://images.gamebanana.com/img/ss/mods/621cf51f27368.jpg",
        preview: false
      },
      {
        spotId: spot4.id,
        url: "https://images.gamebanana.com/img/ss/mods/621cf51f600af.jpg",
        preview: false
      },
      {
        spotId: spot4.id,
        url: "https://images.gamebanana.com/img/ss/mods/621cf51ec932c.jpg",
        preview: false
      },

      // Spot 5
      {
        spotId: spot5.id,
        url: "https://ssb.wiki.gallery/images/thumb/c/c3/SSBU-Fountain_of_Dreams.png/1600px-SSBU-Fountain_of_Dreams.png",
        preview: true
      },

      // Spot 6
      {
        spotId: spot6.id,
        url: "https://ssb.wiki.gallery/images/thumb/3/3b/SSBU-Temple.png/1600px-SSBU-Temple.png",
        preview: true
      },
      {
        spotId: spot6.id,
        url: "https://ssb.wiki.gallery/images/thumb/5/50/SSB4UTemple.png/1600px-SSB4UTemple.png",
        preview: false
      },
      {
        spotId: spot6.id,
        url: "https://ssb.wiki.gallery/images/b/b8/Hyrule_Temple_SSBM.png",
        preview: false
      },
      {
        spotId: spot6.id,
        url: "https://images.gamebanana.com/img/ss/mods/615f6d0d13919.jpg",
        preview: false
      },
     
      // Spot 7
      {
        spotId: spot7.id,
        url: "https://images.gamebanana.com/img/ss/mods/61cdf68c7ffee.jpg",
        preview: true
      },
      {
        spotId: spot7.id,
        url: "https://images.gamebanana.com/img/ss/mods/61cdf6915045f.jpg",
        preview: false
      },
      {
        spotId: spot7.id,
        url: "https://images.gamebanana.com/img/ss/mods/61cdf696948dc.jpg",
        preview: false
      },
      {
        spotId: spot7.id,
        url: "https://images.gamebanana.com/img/ss/mods/61cdf69bbadc6.jpg",
        preview: false
      },
      {
        spotId: spot7.id,
        url: "https://images.gamebanana.com/img/ss/mods/61cdf6a510699.jpg",
        preview: false
      },

      // Spot 8
      {
        spotId: spot8.id,
        url: "https://ssb.wiki.gallery/images/thumb/0/02/SSBU-Smashville.png/1600px-SSBU-Smashville.png",
        preview: true
      },
      {
        spotId: spot8.id,
        url: "https://ssb.wiki.gallery/images/thumb/d/dc/SSB4USmashville.jpg/1600px-SSB4USmashville.jpg",
        preview: false
      },
      {
        spotId: spot8.id,
        url: "https://images.gamebanana.com/img/ss/mods/607b17138fd60.jpg",
        preview: false
      },
      {
        spotId: spot8.id,
        url: "https://images.gamebanana.com/img/ss/mods/63657dbc24050.jpg",
        preview: false
      },
      {
        spotId: spot8.id,
        url: "https://images.gamebanana.com/img/ss/mods/628104a595680.jpg",
        preview: false
      },
    ], options);
  },

  down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'; // Add this line
  
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete(options, null, { transaction });
    });
  }
};
