'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let PaperList =['Certificat négatif', 'Domiciliation', 'Statut et Cachet', 'Enregistrement des statuts', 'Demande de patente', 'demande de RC', 'demande IF', 'Les Annonces', 'Affiliation CNSS']
    await queryInterface.bulkInsert('Papers',
    PaperList.map((paper) => ({
        type : paper,
        createdAt: new Date(),
        updatedAt: new Date()
    })) , {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
