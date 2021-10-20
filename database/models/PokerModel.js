module.exports = (sequelize, Sequelize) => {
  const Poker = sequelize.define('pokers', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    createdBy: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('Open', 'Closed')
    }
  })
  return Poker
}
