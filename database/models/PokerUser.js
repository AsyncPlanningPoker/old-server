const User = require('./UserModel')
const Poker = require('./PokerModel')

module.exports = (sequelize, Sequelize) => {
  const PokerUser = sequelize.define('pokerUsers', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
  })

  PokerUser.associate = (models) =>{
    models['pokerUsers'].belongsToMany(models['rounds'],{
      foreignKey: 'idPokerUser',
      constraints: true,
      through: {
          model: models['votes']
      },
      as: 'allRounds'
    })
  }
  
  return PokerUser
}
