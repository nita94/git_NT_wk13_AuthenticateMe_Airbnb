'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in the options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';

    // demo-user.js
    return queryInterface.bulkInsert(options, [
      {
        id: 1, // Add this line
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 2, // Add this line
        firstName: 'Fake',
        lastName: 'User',
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 3, // Add this line
        firstName: 'Fake',
        lastName: 'User2',
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 4, // Add this line
        firstName: 'Nick',
        lastName: 'Tan',
        email: 'nicktan17@gmail.com',
        username: 'nickt',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        id: 5, // Add this line
        firstName: 'Mike',
        lastName: 'Tyson',
        email: 'miketyson@mike.com',
        username: 'miket',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {}).catch(e => console.error(e));
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2', 'damanager', 'legoat'] }
    }, {}).catch(e => console.error(e));
  }
};
