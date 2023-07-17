const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: 'CASCADE', hooks: true });
    }
  }

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      spotId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Spots',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
        },
      },
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );

  return Review; // Add this line to return the Review class
};
