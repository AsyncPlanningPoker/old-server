const db = require('../database/models')
const Stories = db.stories
const Poker = db.pokers

exports.create = (req, res) => {
  create(req, res)
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Stories.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send({ data })
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar a story com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar a story com o id=${id}` })
    })
}

exports.deleteStory = (req, res) => {
  const id = req.params.id

  Stories.destroy({ where: { id: id } })
    .then(data => {
      if (data) {
        res.sendStatus(200)
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar a story com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para deletar a story com o id=${id}` })
    })
}

async function create (req, res) {
  if (!req.body.name && !req.body.description && !req.body.idPoker) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  if (!await pokerIdExists(req.body.idPoker)) {
    res.status(404).send({ error: true, message: 'PokerId nao existe' })
    return
  }

  const storyData = {
    name: req.body.name,
    description: req.body.description,
    idPoker: req.body.idPoker
  }

  Stories.create(storyData)
    .then(data => {
      const storyId = data.dataValues.id
      res.status(201).send({ success: true, id: storyId })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({ error: true, message: 'Erro ao criar a story.' })
    })
}

async function pokerIdExists (pokerId) {
  if (await Poker.findByPk(pokerId) !== null) {
    return true
  }
}
