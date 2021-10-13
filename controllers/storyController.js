const db = require('../models/sequelizeConfig')
const Stories = db.stories

exports.create = (req, res) => {
  if (!req.body.name && !req.body.description && !req.body.idPoker) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const storyData = {
    name: req.body.name,
    description: req.body.description,
    idPoker: req.body.idPoker
  }

  Stories.create(storyData)
    .then(data => {
      res.status(201).json({ success: true })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({ error: true, message: 'Erro ao criar a story.' })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Stories.findByPk(id)
    .then(data => {
      if (data) {
        const { id, name, description, idPoker } = data
        res.send(200).json({ id, name, description, idPoker })
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar a story com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar a story com o id=${id}` })
    })
}

exports.findByPokerId = (req, res) => {
  const pokerId = req.params.id

  Stories.findAll({ where: { idPoker: pokerId } })
    .then(data => {
      if (data) {
        res.send(200).json(data)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar stories para o projeto=${pokerId}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar stories do projeto=${pokerId}` })
    })
}

exports.deleteStory = (req, res) => {
  const id = req.params.id

  Stories.destroy({where: {id: id}})
    .then(data => {
      if (data) {
        res.send(200).json(data)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar a story com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para deletar a story com o id=${id}` })
    })
}

