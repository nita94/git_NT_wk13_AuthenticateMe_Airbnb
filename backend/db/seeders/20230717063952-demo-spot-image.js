'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const { Spot } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'

    const spot1 = await Spot.findOne({
      where: {
        address: "123 Disney Lane"
      }
    })

    const spot2 = await Spot.findOne({
      where: {
        address: "1010 Fake Street"
      }
    })

    const spot3 = await Spot.findOne({
      where: {
        address: "2020 Volkihar Street"
      }
    })

    const spot4 = await Spot.findOne({
      where: {
        address: "5600 Castle Terrace"
      }
    })

    const spot5 = await Spot.findOne({
      where: {
        address: "5050 Artists Lane"
      }
    })

    const spot6 = await Spot.findOne({
      where: {
        address: "5050 Lakeside Road"
      }
    })

    const spot7 = await Spot.findOne({
      where: {
        address: "6060 Beauty Way"
      }
    })

    const spot8 = await Spot.findOne({
      where: {
        address: "666 Volt Way"
      }
    })

    await queryInterface.bulkInsert(options, [
      {
        spotId: spot1.id,
        url: "https://images.pexels.com/photos/14043487/pexels-photo-14043487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: true
      },
      {
        spotId: spot1.id,
        url: "https://images.pexels.com/photos/17177651/pexels-photo-17177651/free-photo-of-silhouette-of-windows-frame.jpeg?auto=compress&cs=tinysrgb&w=1200",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://images.pexels.com/photos/1170070/pexels-photo-1170070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://images.pexels.com/photos/6957089/pexels-photo-6957089.jpeg?auto=compress&cs=tinysrgb&w=1200",
        preview: false
      },
      {
        spotId: spot1.id,
        url: "https://images.pexels.com/photos/6957097/pexels-photo-6957097.jpeg?auto=compress&cs=tinysrgb&w=1200",
        preview: false
      },
      {
        spotId: spot2.id,
        url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: true
      },
      {
        spotId: spot2.id,
        url: 'https://images.pexels.com/photos/9582414/pexels-photo-9582414.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot2.id,
        url: 'https://images.pexels.com/photos/17386428/pexels-photo-17386428/free-photo-of-minimalist-interior-design.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot2.id,
        url: 'https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot2.id,
        url: 'https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot3.id,
        url: 'https://images.pexels.com/photos/145847/pexels-photo-145847.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: true
      },
      {
        spotId: spot3.id,
        url: 'https://images.pexels.com/photos/218480/pexels-photo-218480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: false
      },
      {
        spotId: spot3.id,
        url: 'https://media.istockphoto.com/id/910827792/photo/3d-rendering-dark-palace.jpg?b=1&s=612x612&w=0&k=20&c=UbVe2AjYaL3UGD296RpoHKCYv3d-Rny1o9mgDFGm9Zs=',
        preview: false
      },
      {
        spotId: spot3.id,
        url: 'https://media.istockphoto.com/id/1480594709/photo/royal-bathroom-with-a-gothic-window-in-a-castle-on-the-sea.jpg?b=1&s=612x612&w=0&k=20&c=7K75Z_A0cmKfjt8y7f8VOYz9qEJGPgQ5pKY_-xvIcdw=',
        preview: false
      },
      {
        spotId: spot3.id,
        url: 'https://media.istockphoto.com/id/1363830876/photo/fantasy-medieval-temple-in-the-castle-3d-illustration.jpg?b=1&s=612x612&w=0&k=20&c=GMmLIdSdpBOIdwBMUcbMVroGE2OPjickNM0uQVoQcX0=',
        preview: false
      },
      {
        spotId: spot4.id,
        url: 'https://images.pexels.com/photos/34223/mont-saint-michel-france-normandy-europe.jpg?auto=compress&cs=tinysrgb&w=1200',
        preview: true
      },
      {
        spotId: spot4.id,
        url: 'https://images.pexels.com/photos/15996636/pexels-photo-15996636/free-photo-of-art-building-tunnel-architecture.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot4.id,
        url: 'https://media.istockphoto.com/id/172236366/photo/stone-staircase-and-courtyard.jpg?b=1&s=612x612&w=0&k=20&c=T14JoVRd1TUxRo8FFUAUH0lhOi8DNXtAFUdSy0erxTc=',
        preview: false
      },
      {
        spotId: spot4.id,
        url: 'https://media.istockphoto.com/id/607477044/photo/gothic-cathedral-interior-3d-illustration.jpg?b=1&s=612x612&w=0&k=20&c=wREVjBA1bzh3GQkoOVqoE4jf0WvHL1nIcFjkc9CgRrc=',
        preview: false
      },
      {
        spotId: spot4.id,
        url: 'https://media.istockphoto.com/id/476433490/photo/columned-arched-gothic-room.jpg?b=1&s=612x612&w=0&k=20&c=OAyGpl4HiSV2yvpfOuOuL8OKcaTeTNiubgkafjLUYk0=',
        preview: false
      },
            {
        spotId: spot5.id,
        url: 'https://images.pexels.com/photos/5563472/pexels-photo-5563472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: true
      },
      {
        spotId: spot5.id,
        url: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot5.id,
        url: 'https://images.pexels.com/photos/931887/pexels-photo-931887.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot5.id,
        url: 'https://images.pexels.com/photos/139764/pexels-photo-139764.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot5.id,
        url: 'https://images.pexels.com/photos/17345918/pexels-photo-17345918/free-photo-of-barcelona-pavilion-in-spain.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot6.id,
        url: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: true
      },
      {
        spotId: spot6.id,
        url: 'https://images.pexels.com/photos/6438744/pexels-photo-6438744.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot6.id,
        url: 'https://images.pexels.com/photos/2434255/pexels-photo-2434255.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot6.id,
        url: 'https://images.pexels.com/photos/5784432/pexels-photo-5784432.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot6.id,
        url: 'https://images.pexels.com/photos/9220877/pexels-photo-9220877.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot7.id,
        url: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: true
      },
      {
        spotId: spot7.id,
        url: 'https://images.pexels.com/photos/12534075/pexels-photo-12534075.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot7.id,
        url: 'https://images.pexels.com/photos/7174404/pexels-photo-7174404.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot7.id,
        url: 'https://images.pexels.com/photos/6957087/pexels-photo-6957087.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot7.id,
        url: 'https://images.pexels.com/photos/6958150/pexels-photo-6958150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: false
      },
      {
        spotId: spot8.id,
        url: 'https://images.pexels.com/photos/819806/pexels-photo-819806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        preview: true
      },
      {
        spotId: spot8.id,
        url: 'https://media.istockphoto.com/id/1288807843/photo/medieval-bedroom-with-a-large-bed.jpg?b=1&s=612x612&w=0&k=20&c=J4LGWE9VXnalnxo-oLWWuBqZT1cN8JUDU2y-_5SIR0k=',
        preview: false
      },
      {
        spotId: spot8.id,
        url: 'https://media.istockphoto.com/id/182913408/photo/luxury-bedroom.jpg?b=1&s=612x612&w=0&k=20&c=Tx4RSxrdythLPZe7zuTkCMW08ivLDykM858qkftXFBY=',
        preview: false
      },
      {
        spotId: spot8.id,
        url: 'https://images.pexels.com/photos/2938918/pexels-photo-2938918.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },
      {
        spotId: spot8.id,
        url: 'https://images.pexels.com/photos/678047/pexels-photo-678047.jpeg?auto=compress&cs=tinysrgb&w=1200',
        preview: false
      },


    ] ,{ validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: [
        'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/5563472/pexels-photo-5563472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/14043487/pexels-photo-14043487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/17177651/pexels-photo-17177651/free-photo-of-silhouette-of-windows-frame.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1170070/pexels-photo-1170070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/6957089/pexels-photo-6957089.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6957097/pexels-photo-6957097.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/9582414/pexels-photo-9582414.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/17386428/pexels-photo-17386428/free-photo-of-minimalist-interior-design.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/534172/pexels-photo-534172.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/145847/pexels-photo-145847.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/218480/pexels-photo-218480.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://media.istockphoto.com/id/910827792/photo/3d-rendering-dark-palace.jpg?b=1&s=612x612&w=0&k=20&c=UbVe2AjYaL3UGD296RpoHKCYv3d-Rny1o9mgDFGm9Zs=',
        'https://media.istockphoto.com/id/1480594709/photo/royal-bathroom-with-a-gothic-window-in-a-castle-on-the-sea.jpg?b=1&s=612x612&w=0&k=20&c=7K75Z_A0cmKfjt8y7f8VOYz9qEJGPgQ5pKY_-xvIcdw=',
        'https://media.istockphoto.com/id/1363830876/photo/fantasy-medieval-temple-in-the-castle-3d-illustration.jpg?b=1&s=612x612&w=0&k=20&c=GMmLIdSdpBOIdwBMUcbMVroGE2OPjickNM0uQVoQcX0=',
        'https://images.pexels.com/photos/34223/mont-saint-michel-france-normandy-europe.jpg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/15996636/pexels-photo-15996636/free-photo-of-art-building-tunnel-architecture.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://media.istockphoto.com/id/172236366/photo/stone-staircase-and-courtyard.jpg?b=1&s=612x612&w=0&k=20&c=T14JoVRd1TUxRo8FFUAUH0lhOi8DNXtAFUdSy0erxTc=',
        'https://media.istockphoto.com/id/607477044/photo/gothic-cathedral-interior-3d-illustration.jpg?b=1&s=612x612&w=0&k=20&c=wREVjBA1bzh3GQkoOVqoE4jf0WvHL1nIcFjkc9CgRrc=',
        'https://media.istockphoto.com/id/476433490/photo/columned-arched-gothic-room.jpg?b=1&s=612x612&w=0&k=20&c=OAyGpl4HiSV2yvpfOuOuL8OKcaTeTNiubgkafjLUYk0=',
        'https://images.pexels.com/photos/5563472/pexels-photo-5563472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/931887/pexels-photo-931887.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/139764/pexels-photo-139764.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/17345918/pexels-photo-17345918/free-photo-of-barcelona-pavilion-in-spain.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/6438744/pexels-photo-6438744.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/2434255/pexels-photo-2434255.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/5784432/pexels-photo-5784432.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/9220877/pexels-photo-9220877.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/12534075/pexels-photo-12534075.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/7174404/pexels-photo-7174404.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6957087/pexels-photo-6957087.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/6958150/pexels-photo-6958150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://images.pexels.com/photos/819806/pexels-photo-819806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        'https://media.istockphoto.com/id/1288807843/photo/medieval-bedroom-with-a-large-bed.jpg?b=1&s=612x612&w=0&k=20&c=J4LGWE9VXnalnxo-oLWWuBqZT1cN8JUDU2y-_5SIR0k=',
        'https://media.istockphoto.com/id/182913408/photo/luxury-bedroom.jpg?b=1&s=612x612&w=0&k=20&c=Tx4RSxrdythLPZe7zuTkCMW08ivLDykM858qkftXFBY=',
        'https://images.pexels.com/photos/2938918/pexels-photo-2938918.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'https://images.pexels.com/photos/678047/pexels-photo-678047.jpeg?auto=compress&cs=tinysrgb&w=1200'

      ] }
    }, {});
  }
};