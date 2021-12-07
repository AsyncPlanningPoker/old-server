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
          }
        }
      }
    })
    

  return Vote
}
