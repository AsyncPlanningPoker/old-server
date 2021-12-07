const db = require('../database/models')
const Vote = db.votes
const Round = db.rounds
const Poker = db.pokers
const Stories = db.stories

exports.getRoundResult= async (req, res) => {
  const idUser = req.decoded.userId
  const idRound = req.params.idRound

  const round = await Round.findByPk(idRound)

  if (round) {
    const players = await round.getAllPokerUsers()
    const player =  players.filter((playerOfList) => {
      return playerOfList.idUser == idUser
    })

    if(player.length == 1) {

      if(round.status == "Closed") {
          const votesOfRound = await Vote.findAll({ where : {idRound: round.id} })
          let max = votesOfRound[0]
          let min = votesOfRound[0]
  
          votesOfRound.forEach(voteRound => {
              if(voteRound.vote > max.vote){
              max = voteRound 
              }
              if(voteRound.vote < min.vote){
              min = voteRound
              }
          })

          if(max == min){
              res.status(200).send({
                  status: round.status, 
                  result: max,
              })
          } else {
              res.status(200).send({
                  status: round.status, 
                  max: max,
                  min: min
              })
          }

      } else {
          const voteOfUser = await Vote.findOne({ 
              where : {
                  idPokerUser: player[0].id,
                  idRound: idRound
              }
          })
          res.status(200).send({
              status: round.status, 
              max: null,
              min: null,
              voteId: voteOfUser.id
          })
      }

    } else {
      res.status(406).json({ error: true, message: 'Operação inválida.' })
    }
  } else {
    res.status(404).send({ error: true, message: "Erro ao consultar voto" })
  }
}

exports.createNexRound= async (req, res) => {
  const idUser = req.decoded.userId
  const idRound = req.params.idRound

  const round = await Round.findByPk(idRound)
  const story = await Stories.findByPk(round.idStory)
  const poker = await Poker.findByPk(story.idPoker)

  if(round.status == "Closed" && poker.createdBy == idUser && story){
    const newRound = await Round.create({
      roundNumber: round.roundNumber + 1,
      status: 'Open',
      idStory: round.idStory
    })
    res.status(201).send({newRound})
  } else {
    res.status(406).json({ error: true, message: 'Operação inválida.' })
  }

}