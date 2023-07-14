'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "/images/exterior/pexels-fomstock-com-1115804.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "/images/bath/pexels-christa-grover-1909791.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "/images/interior/pexels-ilya-shakir-2440471.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "/images/kitchen/pexels-alex-qian-2343467.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "/images/bedroom/pexels-curtis-adams-3555618.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/exterior/pexels-scott-webb-1029599.jpg",
        preview: true
      },
      {
        spotId: 2,
        url: "/images/bath/pexels-christa-grover-1909791.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/bedroom/pexels-dominika-roseclay-2146070.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/interior/pexels-terry-magallanes-2988860.jpg",
        preview: false
      },
      {
        spotId: 2,
        url: "/images/kitchen/pexels-dmitry-zvolskiy-2062426.jpg",
        preview: false
      },
      {
        spotId: 3,
        url: "/images/White-House-exterior.webp",
        preview: true
      },
      {
        spotId: 3,
        url: "/images/white-house-interior-2.jpeg",
        preview: false
      },
      {
        spotId: 3,
        url: "/images/white-house-interior.html",
        preview: false
      },
      {
        spotId: 3,
        url: "/images/white-house-haunted.jpeg",
        preview: false
      },
      {
        spotId: 3,
        url: "/images/white-house-obama.avif",
        preview: false
      },
      {
        spotId: 4,
        url: "/images/exterior/pexels-ricky-esquivel-1586298.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "/images/bedroom/pexels-maria-orlova-4906522.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "/images/bath/pexels-max-rahubovskiy-6032203.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "/images/interior/pexels-vecislavas-popa-1571470.jpg",
        preview: false
      },
      {
        spotId: 4,
        url: "/images/kitchen/pexels-mark-mccammon-1080721.jpg",
        preview: false
      },
      {
        spotId: 5,
        url: "/images/exterior/pexels-zoe-koskinioti-2183521.jpg",
        preview: true
      },
      {
        spotId: 5,
        url: "/images/interior/pexels-victoria-rain-1648776.jpg",
        preview: false
      },
      {
        spotId: 5,
        url: "/images/kitchen/pexels-terry-magallanes-3623785.jpg",
        preview: false
      },
      {
        spotId: 5,
        url: "/images/bedroom/pexels-suhel-vba-3659683.jpg",
        preview: false
      },
      {
        spotId: 5,
        url: "/images/bath/pexels-taryn-elliott-4540491.jpg",
        preview: false
      },


    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};