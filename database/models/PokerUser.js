const User = require('./UserModel')
const Poker = require('./PokerModel')

module.exports = (sequelize, Sequelize) => {
  const PokerUser = sequelize.define('pokerUser', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
  })

  PokerUser.associate = (models) =>{
  }
  
  return PokerUser
}
