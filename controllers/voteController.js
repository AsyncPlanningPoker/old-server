const db = require('../database/models')
const Vote = db.votes
const PokerUser = db.pokerUsers

exports.voteRound = async (req, res) => {
  const idUser = req.decoded.userId
  const idVote = req.params.idVote
  const playerVote = req.body.voteNumber
  const playerComment = req.body.voteComment

  const voteOfPlayer = await Vote.findByPk(idVote)
  if(voteOfPlayer && playerVote &&  playerComment) {
    const pokerUserVote = await PokerUser.findByPk(voteOfPlayer.idPokerUser)
    if(pokerUserVote.idUser == idUser){
      if(voteOfPlayer.vote == null){
        await Vote.update({
          vote: parseInt(playerVote),
          comment: playerComment
        },
        { 
          where: { id: voteOfPlayer.id } 
        })
        res.status(200).send({ voteId: voteOfPlayer.id })
      } else{
        res.status(406).json({ error: true, message: 'Round já votado.' })
      }
    }
  }else {
    res.status(404).send({ error: true, message: "Erro ao votar" })
  }
}