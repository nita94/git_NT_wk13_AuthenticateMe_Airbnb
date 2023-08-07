'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
   
    static associate(models) {
      Booking.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      )

      Booking.belongsTo(
        models.Spot,
        { foreignKey: 'spotId'}
      )
    }
  }
  Booking.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allownull: false,
      type: DataTypes.INTEGER
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATEONLY
    }
  }, {
    sequelize,
    modelName: 'Booking',
    scopes: {
      notOwner(id) {
        return {
          attributes: {
            exclude: ['userId', 'createdAt', 'updatedAt']
          }
        }
      }
    }
  });
  return Booking;
};