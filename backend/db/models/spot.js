"use strict";

const { Model, Validator } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: "Owner"
      });

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  };

  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,256]
        }
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,30]
        }
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,30]
        }
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,30]
        }
      },
      lat: {
        type: DataTypes.DOUBLE,
        validate: {
          min: -90,
          max: 90
        }
      },
      lng: {
        type: DataTypes.DOUBLE,
        validate: {
          min: -180,
          max: 180
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,256]
        }
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1,256]
        }
      },
      price: {
        type: DataTypes.REAL,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};