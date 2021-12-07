const db = require('../database/models')
const Story = db.stories
const Round = db.rounds
const Poker = db.pokers
const User = db.users
const Vote = db.votes
const PokerUser = db.pokerUsers

exports.create = (req, res) => {
  create(req, res)
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Vote.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send({ data })
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar o voto com id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar o voto com o id=${id}` })
    })
}

exports.deleteVote = (req, res) => {
  const idUser = req.body.idUser
  const idPoker = req.body.idPoker

  Vote.destroy({ where: { idUser: idUser, idPoker: idPoker } })
    .then(data => {
      if (data) {
        res.sendStatus(200)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar voto com pokerId=${idPoker} e userId=${idUser}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error ao deletar voto com pokerId=${idPoker} e userId=${idUser}.` })
    })
}




exports.deletePoker = (req, res) => {
  const idPoker = req.params.id

  Vote.destroy({ where: { idPoker: idPoker } })
    .then(data => {
      if (data) {
        res.sendStatus(200)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar voto com pokerId=${idPoker}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error ao deletar voto com pokerId=${idPoker}.` })
    })
}

exports.deleteUser = (req, res) => {
  const idUser = req.params.id

  Vote.destroy({ where: { idUser: idUser } })
    .then(data => {
      if (data) {
        res.sendStatus(200)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar voto com userId=${idUser}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error ao deletar voto com userId=${idUser}.` })
    })
}

exports.deleteStory = (req, res) => {
  const idStory = req.params.idP

  Vote.destroy({ where: { idStory: idStory } })
    .then(data => {
      if (data) {
        res.sendStatus(200)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar voto com storyId=${idStory}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error ao deletar voto com storyId=${idStory}.` })
    })
}

async function create (req, res) {
  if (!req.body.idRound || !req.body.idUser || !req.body.idPoker || !req.body.vote) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  if (!await voteCanBeCasted(req.body.idPoker, req.body.idUser, req.body.idRound)) {
    res.status(404).send({ error: true, message: 'Parametros informados nao permitem o voto' })
    return
  }

  const { id: idPokerUser } = await PokerUser.findOne({ where: { idPoker: req.body.idPoker, idUser: req.body.idUser }})

  const voteData = {
    idRound: req.body.idRound,
    idPokerUser,
    vote: req.body.vote,
    comment: req.body.comment
  }

  if (await alreadyVoted(req.body.idPoker, req.body.idUser, req.body.idRound)) {
    Vote.update({
        vote: req.body.vote, 
        comment: req.body.comment
      }, {
      where: {
        idPokerUser,
        idRound: req.body.idRound,
      }
    })
      .then(data => {
        res.status(201).send({ success: true, data: data })
      })
      .catch(err => {
        console.log(err.message)
        res.status(500).send({ error: true, message: 'Erro ao atualizar voto.' })
      })
  } else {
    Vote.create(voteData)
      .then(data => {
        res.status(201).send({ success: true, data: data })
      })
      .catch(err => {
        console.log(err.message)
        res.status(500).send({ error: true, message: 'Erro ao criar voto.' })
      })
  }
}

async function voteCanBeCasted (pokerId, userId, idRound) {
  if (!pokerUserExists({ pokerId, userId }) || !roundIdExists(idRound)) {
    return false
  }
  return true
}

async function pokerUserExists ({ userId, pokerId }) {
  if (await PokerUser.findOne({ where: { idPoker: pokerId, idUser: userId }}) !== null) {
    return true
  }
  return false
}

async function roundIdExists (storyId) {
  if (await Round.findByPk(storyId) !== null) {
    return true
  }
  return false
}

async function alreadyVoted (idPoker, idUser, idRound) {
  const pokerUser = await PokerUser.findOne({
    where: { 
      idPoker: idPoker,
      idUser: idUser
    }
  })

  if(!pokerUser) return false
  
  const result = await Vote.findAll({
    where: {
      idPokerUser: pokerUser.id,
      idRound: idRound
    }
  })

  console.log(result.length)
  if (result.length > 0) {
    return true
  }
  return false
}
