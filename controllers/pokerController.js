const db = require('../database/models')
const Poker = db.pokers
const Stories = db.stories
const PokerUser = db.pokerUser
const Vote = db.votes
const { Op } = require('sequelize')

exports.create = (req, res) => {
  if (!req.body.name && !req.body.createdBy) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const pokerData = {
    name: req.body.name,
    createdBy: req.body.createdBy,
    status: 'Open'
  }

  Poker.create(pokerData)
    .then(data => {
      const pokerId = data.dataValues.id
      const pokerUserData = {
        idUser: req.body.createdBy,
        idPoker: pokerId
      }
      PokerUser.create(pokerUserData)
      res.status(201).json({ success: true, id: pokerId })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({ error: true, message: 'Erro ao criar o poker.' })
    })
}

exports.addUser = (req, res) => {
  if (!req.body.idPoker && !req.body.idUser) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const pokerUserData = {
    idUser: req.body.idUser,
    idPoker: req.body.idPoker
  }

  PokerUser.create(pokerUserData)
    .then(data => {
      const pokerDataId = data.dataValues.id
      res.status(201).json({ success: true, id: pokerDataId })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({ error: true, message: 'Erro ao associar usuario ao poker.' })
    })
}

exports.createdByUser = (req, res) => {
  const idUser = req.decoded.userId
  if (!req.decoded.userId) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  Poker.findAll({ where: { createdBy: idUser } })
    .then(data => {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar pokers para o user=${idUser}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar pokers para o usuario=${idUser}` })
    })
}

exports.findPokerWithMissingVotesByUser = (req, res) => {
  findPokerWithMissingVotesByUser(req, res)
}

exports.fromUser = (req, res) => {
  const idUser = req.decoded.userId
  if (!req.decoded.userId) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  PokerUser.findAll({ where: { idUser: idUser } })
    .then(data => {
      if (data) {
        // TODO: ele ta voltando o obj PokerUser inteiro, precisa mudar a response pra voltar so uma lista de pokerId
        res.status(200).send(data)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar pokers para o user=${idUser}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar pokers para o usuario=${idUser}` })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Poker.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send({ data })
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar o poker com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar o poker com o id=${id}` })
    })
}

exports.findStoriesByPokerId = (req, res) => {
  const pokerId = req.params.pokerId

  Stories.findAll({ where: { idPoker: pokerId } })
    .then(data => {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar stories para o projeto=${pokerId}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar stories do projeto=${pokerId}` })
    })
}

exports.deletePoker = (req, res) => {
  const id = req.params.id

  Poker.destroy({ where: { id: id } })
    .then(data => {
      if (data) {
        Stories.destroy({ where: { idPoker: id } })
        res.sendStatus(200)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar o poker com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para deletar o poker com o id=${id}` })
    })
}

async function findPokerWithMissingVotesByUser (req, res) {
  const idUser = req.decoded.userId
  const pokerIdsUserBelongsTo = await findPokersFromUser(idUser)
  const storiesUserVoted = await findVotesFromUserAndPoker(idUser, pokerIdsUserBelongsTo)
  const missingVotes = await findMissingVotes(pokerIdsUserBelongsTo, storiesUserVoted)
  res.status(200).send(missingVotes)
}

async function findPokersFromUser (idUser) {
  const pokerIdsUserBelongsTo = []

  await PokerUser.findAll({ where: { idUser: idUser } })
    .then(data => {
      if (data) {
        data.forEach(element => {
          pokerIdsUserBelongsTo.push(element.dataValues.idPoker)
        })
      }
    })

  return pokerIdsUserBelongsTo
}

async function findVotesFromUserAndPoker (idUser, pokerList) {
  const votes = []

  await Vote.findAll({
    where: {
      idUser: idUser,
      idPoker: { [Op.in]: pokerList }
    }
  }).then(data => {
    if (data) {
      data.forEach(element => {
        votes.push(element.dataValues.idStory)
      })
    }
  })

  return votes
}

async function findMissingVotes (pokerList, storyList) {
  const objList = []
  for (let i = 0; i < pokerList.length; i++) {
    const storiesList = []
    await Stories.findAll({ where: { idPoker: pokerList[i], id: { [Op.notIn]: storyList } } }).then(data => { if (data) { data.forEach(element => { storiesList.push(element.dataValues.id) }) } })
    if (storiesList.length !== 0) {
      const obj = {
        idPoker: pokerList[i],
        stories: storiesList
      }
      objList.push(obj)
    }
  }

  return objList
}
