const mailService = require("../../services/MailService")

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
    },
    {
      hooks: {
        afterBulkUpdate: async (vote) => {
          const models = sequelize.models
          const voteObj = await models.votes.findByPk(vote.where.id)
          const AllVotesInRound = await models.votes.findAll({where: {idRound: voteObj.idRound}})

          const filteredVotes = AllVotesInRound.filter((voteOfList) => {
            return voteOfList.vote == null
          })

          if(filteredVotes.length == 0){
            await models.rounds.update({status:'Closed'},{ where: { id: voteObj.idRound }})
            const round = await models.rounds.findByPk(voteObj.idRound)
            const story = await models.stories.findByPk(round.idStory) 
            const poker = await models.pokers.findByPk(story.idPoker)
            const user = await models.users.findByPk(poker.createdBy)
            
            mailService.sendMail(
              user.email,
              "Round finalizado",
              "round-finished",
              { 
                username: user.name,
                pokerId: poker.id,
                pokerName: poker.name,
                storyId: story.id,
                storyName: story.name,
                roundNumber: round.roundNumber
              }
            )
          }

        }
      }
    })
    

  return Vote
}
