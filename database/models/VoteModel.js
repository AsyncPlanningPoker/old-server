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

    Vote.associate = (models) =>{
      models['votes'].belongsTo(models['pokerUsers'],{
        constraint: true,
        foreignKey: 'idPokerUser',
        targetKey: 'id'
      })
      models['votes'].belongsTo(models['rounds'],{
        constraint: true,
        foreignKey: 'idRound',
        targetKey: 'id'
      })
    }
    

  return Vote
}
