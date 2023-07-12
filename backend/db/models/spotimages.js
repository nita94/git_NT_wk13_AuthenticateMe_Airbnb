// SpotImage.js
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      SpotImage.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: 'CASCADE', hooks: true });
    }
  }

  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Spots',
        },
        onDelete: 'CASCADE',
      },
      url: DataTypes.STRING,
      preview: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'SpotImage',
    }
  );

  return SpotImage;
};
