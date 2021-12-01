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
    status: {
      type: Sequelize.ENUM('Open', 'Closed')
    }
  })

  Poker.associate = (models) => {
    models['pokers'].belongsTo(models['users'], {
      constraint: true,
      foreignKey: 'createdBy',
      targetKey: 'id'
    })

    models['pokers'].belongsToMany(models['users'],{
      foreignKey: 'idPoker',
      constraints: true,
      through: {
          model: models['pokerUsers']
      },
      as: 'allUsers'
    })

    models['pokers'].hasMany(models['stories'],{
      foreignKey: 'idPoker',
      onDelete: 'CASCADE',
      as: 'allStories' 
    })
  }
  return Poker
}
