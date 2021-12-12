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

    const pokerOwner = await Poker.findByPk(players[0].idPoker)

    if(player.length == 1 && pokerOwner) {

      const nextRound = await Round.findOne({
        where: {
          idStory: round.idStory,
          roundNumber: round.roundNumber + 1 
        }
      })
      const votesOfRound = await Vote.findAll({ where : {idRound: round.id} })
      const voteOfUser = await Vote.findOne({ 
        where : {
            idPokerUser: player[0].id,
            idRound: idRound
        }
      })

      voteUserObj = {
        voteNumber: voteOfUser.vote,
        voteComment: voteOfUser.comment
      }

      if(round.status == "Closed") {

        let max = min = {
          voteNumber : votesOfRound[0].vote,
          voteComment: votesOfRound[0].comment
        }

        votesOfRound.forEach(voteRound => {
            if(voteRound.vote > max.voteNumber){
              max = {
                voteNumber : voteRound.vote,
                voteComment: voteRound.comment,
              } 
            }
            if(voteRound.vote < min.voteNumber){
              min = {
                voteNumber : voteRound.vote,
                voteComment: voteRound.comment,
              }
            }
        })

        res.status(200).send({
          isPokerOwner: pokerOwner.createdBy == idUser ? true : false,
          status: round.status, 
          result: min == max ? "Unique" : "NotUnique",
          voteId: voteOfUser.id,
          voteUser: voteUserObj,
          max: max,
          min: min,
          nextRoundCreate: nextRound ? true : false
        })

      } else {

        res.status(200).send({
          isPokerOwner: pokerOwner.createdBy == idUser ? true : false,
          status: round.status, 
          result: "NotDefined",
          voteId: voteOfUser.id,
          voteUser: voteUserObj,
          max: null,
          min: null,
          nextRoundCreate: nextRound ? true : false
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
    const nextRound = await Round.findOne({
      where: {
        idStory: round.idStory,
        roundNumber: round.roundNumber + 1 
      }
    })

    if(nextRound){
      res.status(406).json({ error: true, message: 'Round já criado.' })
    } else {
      const newRound = await Round.create({
        roundNumber: round.roundNumber + 1,
        status: 'Open',
        idStory: round.idStory
      })
      res.status(201).send({newRound})
    }
  } else {
    res.status(406).json({ error: true, message: 'Operação inválida.' })
  }

}