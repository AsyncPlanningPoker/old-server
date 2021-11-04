module.exports = (sequelize, Sequelize) => {
  const PokerUser = sequelize.define('pokerUser', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idPoker: {
      type: Sequelize.STRING
    },
    idUser: {
      type: Sequelize.STRING
    }
  })
  return PokerUser
}
