const db = require('../database/models')
const Poker = db.pokers
const Stories = db.stories

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
      res.status(201).json({ success: true, id: pokerId })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({ error: true, message: 'Erro ao criar o poker.' })
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
