'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Projects','user_id', {type:Sequelize.INTEGER})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Projects','user_id')
  }
};
