'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaperAdvancement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PaperAdvancement.belongsTo(models.User, {foreignKey: 'UserId'})
      PaperAdvancement.belongsTo(models.Paper, {foreignKey: 'PaperId'})
    }
  };
  PaperAdvancement.init({
    advancement: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaperAdvancement',
  });
  return PaperAdvancement;
};