module.exports = (sequelize, Sequelize) => {
  const Story = sequelize.define('stories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
    },
    {
      hooks: {
        afterCreate: async (story, options) => {
          await sequelize.models.rounds.create({
            roundNumber: 1,
            status: 'Open',
            idStory: story.id
          })
        }
      }
    }
  )

  Story.associate = (models) => {
    models['stories'].belongsTo(models['pokers'], {
      constraint: true,
      foreignKey: 'idPoker',
      targetKey: 'id'
    })

    models['stories'].hasMany(models['rounds'],{
      foreignKey: 'idStory',
      onDelete: 'CASCADE',
      as: 'allRounds' 
    })
  }
  return Story
}
