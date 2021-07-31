'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Paper, {through: models.PaperAdvancement})
    }
  };
  User.init({
    prenom: DataTypes.STRING,
    nom: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    bDate: DataTypes.DATE,
    nomE: DataTypes.STRING,
    typeE: DataTypes.STRING,
    nbrAssocies: DataTypes.INTEGER,
    listWithNomAndPathCin: DataTypes.STRING,
    listGerant: DataTypes.STRING,
    sectActi: DataTypes.STRING,
    capital: DataTypes.STRING,
    validationComptable: DataTypes.STRING,
    role:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};