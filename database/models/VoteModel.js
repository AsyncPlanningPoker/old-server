module.exports = (sequelize, Sequelize) => {
  const Vote = sequelize.define('votes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      comment: {
        type: Sequelize.TEXT,
        defaultValue: "",
      },
      vote: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      }
    })

  return Vote
}
