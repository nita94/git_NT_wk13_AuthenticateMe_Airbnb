/** @type {import('sequelize-cli').Migration} */
'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    try {
      await queryInterface.bulkInsert(options, [
        {
          firstName: 'Nick',
          lastName: 'Tan',
          email: 'nick@demo.io',
          username: 'xNickTanx',
          hashedPassword: bcrypt.hashSync('password')
        },
        {
          firstName: 'Grace',
          lastName: 'Tan',
          email: 'grace@demo.io',
          username: 'xGraceTanx',
          hashedPassword: bcrypt.hashSync('password')
        },
        {
          firstName: 'Toni',
          lastName: 'Tan',
          email: 'toni@user.io',
          username: 'ToniTan',
          hashedPassword: bcrypt.hashSync('password2')
        },
        {
          firstName: 'Tom',
          lastName: 'Tan',
          email: 'tom@user.io',
          username: 'TomTan',
          hashedPassword: bcrypt.hashSync('password3')
        },
        {
          firstName: 'Authy',
          lastName: 'Tan',
          email: 'authy@user.io',
          username: 'authDemoUser1',
          hashedPassword: bcrypt.hashSync('password4')
        },
        {
          firstName: 'Demo',
          lastName: 'Tan',
          email: 'demotesting1@demotesting.io',
          username: 'authDemoUser2',
          hashedPassword: bcrypt.hashSync('password')
        }
      ], { validate: true });
    } catch (error) {
      console.error(error);
    }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['xNickTanx', 'xGraceTanx', 'ToniTan', 'TomTan', 'authDemoUser1', 'authDemoUser2'] }
    }, {});
  }
};
