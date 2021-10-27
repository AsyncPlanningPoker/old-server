module.exports = (sequelize, Sequelize) => {
  const Vote = sequelize.define('votes', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    idStory: {
      allowNull: false,
      type: Sequelize.STRING
    },
    idUser: {
      allowNull: false,
      type: Sequelize.STRING
    },
    idPoker: {
      allowNull: false,
      type: Sequelize.STRING
    },
    vote: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  })
  return Vote
}
