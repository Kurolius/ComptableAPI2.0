'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      prenom: {
        type: Sequelize.STRING
      },
      nom: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      bDate: {
        type: Sequelize.DATE
      },
      nomE: {
        type: Sequelize.STRING
      },
      typeE: {
        type: Sequelize.STRING
      },
      nbrAssocies: {
        type: Sequelize.STRING
      },
      listAssocies: {
        type: Sequelize.STRING
      },
      listGerant: {
        type: Sequelize.STRING
      },
      sectActi: {
        type: Sequelize.STRING
      },
      capital: {
        type: Sequelize.STRING
      },
      validationComptable: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};