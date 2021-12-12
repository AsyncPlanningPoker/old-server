const mailService = require("../../services/MailService")

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
          const usersInPoker = await models.pokerUsers.findAll({where : { idPoker: poker.id }})

          if (story && poker && usersInPoker){
            
            usersInPoker.forEach( async userInPoker => {
                await models.votes.create({
                  idRound: round.id,
                  idPokerUser: userInPoker.id
                })

                const user = await models.users.findByPk(userInPoker.idUser)
                mailService.sendMail(
                  user.email,
                  "Novo round criado e pronto para o início votação",
                  "new-round",
                  { 
                    username: user.name,
                    pokerId: poker.id,
                    pokerName: poker.name,
                    storyId: story.id,
                    storyName: story.name,
                    roundNumber: round.roundNumber
                  }
                )
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

    models['rounds'].belongsToMany(models['pokerUsers'],{
      foreignKey: 'idRound',
      constraints: true,
      through: {
          model: models['votes']
      },
      as: 'allPokerUsers'
    })

    models['rounds'].hasOne(models['votes'],{
      foreignKey: 'idRound',
      onDelete: 'CASCADE',
      as: 'vote' 
    })
  }
  return Round
}

  