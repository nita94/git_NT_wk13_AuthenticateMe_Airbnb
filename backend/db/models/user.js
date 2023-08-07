'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
  
      User.hasMany(
        models.Spot,
        { foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true }
      )

      User.hasMany(
        models.Booking,
        { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }
      )

      User.hasMany(
        models.Review,
        { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true }
      )
    }
  }
  User.init(
    {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isAlpha: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if(Validator.isEmail(value)) {
            throw new Error("Cannot be an email.")
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      getSpotOwner(id) {
        return {
          attributes: {
            exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt', 'username']
          }
        }
      }
    }
  });
  return User;
};