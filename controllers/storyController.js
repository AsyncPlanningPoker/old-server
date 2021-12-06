const db = require('../database/models')
const Stories = db.stories
const Poker = db.pokers
const Rounds = db.rounds
const PokerUser = db.pokerUsers

exports.create = async (req, res) => {
  if (req.body.name && req.body.description && req.body.idPoker) {
    const idUser = req.decoded.userId
    const getPoker = await Poker.findByPk(req.body.idPoker);

    if (getPoker && getPoker.createdBy == idUser && getPoker.status == 'Open') {
      const newStory = await Stories.create({
        name: req.body.name,
        description: req.body.description,
        idPoker: getPoker.id
      })
      res.status(201).send({ success: true, id: newStory.id })
    } else {
      res.status(500).send({ error: true, message: "Erro ao criar a story." })
    }
  } else {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

}

exports.findOne = (req, res) => {
  const id = req.params.id

  Stories.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send({ data })
      } else {
        res.status(404).send({ error: true, message: "Não foi possível localizar a story" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: "Error para retornar a story" })
    })
}

exports.deleteStory = async (req, res) => {
  const idUser = req.decoded.userId
  const idStory = req.params.id

  const storie = await Stories.findByPk(idStory)
  const poker = await Poker.findByPk(storie.idPoker)
  
  if(storie && poker.createdBy == idUser){
    const deletedStorie = Stories.destroy({ where: { id: storie.id } })
    if (deletedStorie) {
      res.sendStatus(200)
    }else{
      res.status(404).send({ error: true, message: "Não foi possível localizar a história" })
    }
  } else {
    res.status(500).send({ error: true, message: "Error para deletar a story" })
  }
}

exports.findAllRounds = async (req, res) => {
  const idStory = req.params.idStory
  const idUser = req.decoded.userId

  const storie = await Stories.findByPk(idStory)
  
  if (storie) {
    const rounds = await Rounds.findAll({
      where: { idStory },
      include: { model: PokerUser, as: 'allPokerUsers', where: {idUser} }
    })
    res.status(200).send(rounds)
  } else{
    res.status(404).send({error: true, message: "Story não encontrada."})
  }
}