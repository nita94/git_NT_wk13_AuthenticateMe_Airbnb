'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Spots' },
        onDelete: 'CASCADE',
        hooks: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users' },
        onDelete: 'CASCADE',
        hooks: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);

    options.tableName = 'Bookings';
    await queryInterface.addConstraint(options, {
      fields: ['endDate'],
      type: 'check',
      where: {
        endDate: { [Sequelize.Op.gte]: Sequelize.col('startDate') },
      },
      name: 'Bookings_endDate_check'
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.removeConstraint(options, 'Bookings_endDate_check');
    await queryInterface.dropTable('Bookings');
  }
};
