'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      )
    }
  }
  SpotImage.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
    },
    preview: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {
        exclude: ['spotId', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      deleteImage(id) {
        return {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      }
    }
  });
  return SpotImage;
};