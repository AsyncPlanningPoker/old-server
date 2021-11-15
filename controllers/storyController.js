const db = require('../database/models')
const Stories = db.stories
const Poker = db.pokers

exports.create = async (req, res) => {
  const idUser = req.decoded.userId
  if (!req.body.name && !req.body.description && !req.body.idPoker) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const getPoker = await Poker.findByPk(req.body.idPoker);

  if (getPoker && getPoker.createdBy == idUser) {
    const newStory = await Stories.create({
      name: req.body.name,
      description: req.body.description,
      idPoker: getPoker.id
    })
    res.status(201).send({ success: true, id: newStory.id })
  } else {
    res.status(500).send({ error: true, message: 'Erro ao criar a story.' })
  }
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
      res.status(404).send({ error: true, message: `Não foi possível localizar o a história com o id=${id}.` })
    }
  } else {
    res.status(500).send({ error: true, message: `Error para deletar a story com o id=${id}` })
  }

  /* 
    Quando um poker é deletado o campo idPoker das Stories que pertence a esse poker
    é setado para null, não sendo deletados e permanecendo no banco.
  */
}