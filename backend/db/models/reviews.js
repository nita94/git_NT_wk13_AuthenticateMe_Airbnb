'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    
    static associate(models) {
    
      Review.belongsTo(
        models.User,
        { foreignKey: 'userId' }
      )

      Review.hasMany(
        models.ReviewImage,
        { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true }
      )

      Review.belongsTo(
        models.Spot,
        { foreignKey: 'spotId' }
      )
    }
  }
  Review.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    review: {
      type: DataTypes.STRING
    },
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};