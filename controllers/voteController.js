const db = require('../database/models')
const Story = db.stories
const Poker = db.pokers
const User = db.users
const Vote = db.votes

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
  if (!req.body.idStory || !req.body.idUser || !req.body.idPoker || !req.body.vote) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  if (!await voteCanBeCasted(req.body.idPoker, req.body.idUser, req.body.idStory)) {
    res.status(404).send({ error: true, message: 'Parametros informados nao permitem o voto' })
    return
  }

  const voteData = {
    idStory: req.body.idStory,
    idUser: req.body.idUser,
    idPoker: req.body.idPoker,
    vote: req.body.vote
  }

  if (await alreadyVoted(req.body.idPoker, req.body.idUser, req.body.idStory)) {
    Vote.update({ vote: req.body.vote }, {
      where: {
        idPoker: req.body.vote,
        idUser: req.body.idUser,
        idStory: req.body.idStory
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

async function voteCanBeCasted (pokerId, userId, storyId) {
  if (!pokerIdExists(pokerId) || !userIdExists(userId) || !storyIdExists(storyId)) {
    return false
  }
  return true
}

async function pokerIdExists (pokerId) {
  if (await Poker.findByPk(pokerId) !== null) {
    return true
  }
  return false
}

async function userIdExists (userId) {
  if (await User.findByPk(userId) !== null) {
    return true
  }
  return false
}

async function storyIdExists (storyId) {
  if (await Story.findByPk(storyId) !== null) {
    return true
  }
  return false
}

async function alreadyVoted (idPoker, idUser, idStory) {
  const result = await Vote.findAll({
    where: {
      idPoker: idPoker,
      idStory: idStory,
      idUser: idUser
    }
  })

  console.log(result.length)
  if (result.length > 0) {
    return true
  }
  return false
}
