module.exports = (sequelize, Sequelize) => {
  const Round = sequelize.define('rounds', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      roundNumber: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Open', 'Closed')
      },
    },
    {
      hooks: {
        afterCreate: async (round) => {
          const models = sequelize.models
          const story = await models.stories.findByPk(round.idStory)
          const poker = await models.pokers.findByPk(story.idPoker)
          const usersInPoker = await models.pokerUser.findAll({where : {idPoker: poker.id}})

          if (story && poker && usersInPoker){
            
            usersInPoker.forEach( async userInPoker => {
                console.log(userInPoker.idUser)
                await models.votes.create({
                  idRound: round.id,
                  idPokerUser: userInPoker.id
                })
            })
          }
        }
      }
    }
  )

  Round.associate = (models) => {
    models['rounds'].belongsTo(models['stories'], {
      constraint: true,
      foreignKey: 'idStory',
      targetKey: 'id'
    })

    models['rounds'].belongsToMany(models['pokerUser'],{
      foreignKey: 'idRound',
      constraints: true,
      through: {
          model: models['votes']
      },
      as: 'allPokerUsers'
    })
  }
  return Round
}

  