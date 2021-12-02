const db = require('../database/models')
const Poker = db.pokers
const Users = db.users
const PokerUser = db.pokerUsers

exports.create = async (req, res) => {
  const idUser = req.decoded.userId
  if (!req.body.name && !idUser) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const user =  await Users.findByPk(idUser)
  if (user) {
    const newPoker = await Poker.create({
      name: req.body.name,
      createdBy: user.id,
      status: 'Open'
    })

    const newPokerUser = await PokerUser.create({
      idUser: user.id,
      idPoker: newPoker.id
    })

    res.status(201).json({ success: true, id: newPoker.id })
  }else{
    res.status(500).send({ error: true, message: 'Erro ao criar o poker.' })
  }
}

exports.addUser = async (req, res) => {
  const idUser = req.decoded.userId
  if (!req.body.idPoker && !req.body.email) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const user = await Users.findOne({ where: { email: req.body.email } })

  const poker = await Poker.findByPk(req.body.idPoker)
  if (user && poker) {
    if(poker.createdBy == idUser){

      const pokerUserData = {
        idUser: user.id,
        idPoker: poker.id
      }
  
      const userHasAssoc = await PokerUser.findOne({ where: pokerUserData })
  
      if(userHasAssoc) {
        res.status(405).json({  error: true, message: 'Usuário já faz parte do poker.' })
      } else {
        const addPokerUser = await PokerUser.create(pokerUserData)
        if (addPokerUser) {
          res.status(201).json({ success: true, id: addPokerUser.id })
        } else {
          res.status(405).send({ error: true, message: 'Erro ao associar usuario ao poker.' })
        }
      }

    } else {
      res.status(406).json({  error: true, message: 'Ação não permitida.' })
    }
  } else {
    res.status(400).send({ error: true, message: 'Informações inválidas.' })
  }

}

exports.createdByUser = async (req, res) => {
  const idUser = req.decoded.userId
  if (!req.decoded.userId) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const user = await Users.findByPk(idUser)

  if (user) {
    const poker = await user.getCreatedPokers()
    const data = poker.map(( key ) => {
      return key.dataValues
    })
    res.status(200).send(data)
    
  } else {
    res.status(500).send({ error: true, message: `Error para retornar pokers para o usuario=${idUser}` })
  }

}

exports.fromUser = async (req, res) => {
  const idUser = req.decoded.userId
  if (!req.decoded.userId) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const user = await Users.findByPk(idUser)
  
  if (user) {
    const allPokers = await user.getAllPokers()
    const data = await Promise.all(
      allPokers.map( async ( poker ) => {
        const userCreateBy = await Users.findByPk(poker.dataValues.createdBy)

        return {
          idPoker: poker.dataValues.id,
          name: poker.dataValues.name,
          createdBy: userCreateBy.name,
          createdByEmail: userCreateBy.email,
          status: poker.dataValues.status
        }

      })
    )
    res.status(200).send(data)
  } else {
    res.status(500).send({ error: true, message: "Error para retornar pokers para o usuario" })
  }
}


exports.pokerPlayersById = async (req, res) => {
  const idPoker = req.params.pokerId
  if (!idPoker) {
    res.status(405).send({ error: true, message: "Erro no corpo da requisição." })
  }

  const poker = await Poker.findByPk( idPoker )

  if( poker ){
    const playersOfPoker = await poker.getAllUsers();
    const data = playersOfPoker.map(( user ) => {
      return {
        name: user.name,
        email: user.email
      } 
    })
    res.status(200).send( data )       
  } else {
    res.status(404).send({ error: true, message: "Poker não existe" })
  }
  
}

exports.deletePoker = async (req, res) => {
  const id = req.params.id
  const idUser = req.decoded.userId

  const poker = await Poker.findByPk(id)

  if(poker && poker.createdBy == idUser){
    const deletedPoker = Poker.destroy({ where: { id: poker.id } })
    if (deletedPoker) {
      res.sendStatus(200)
    }else{
      res.status(404).send({ error: true, message: `Não foi possível localizar o poker com o id=${id}.` })
    }
  }else{
    res.status(500).send({ error: true, message: `Error para deletar o poker com o id=${id}` })
  }
}

exports.findOne = ( req, res ) => {
  const id = req.params.id

  Poker.findByPk(id)
    .then( data => {
      if ( data ) {
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

exports.findStoriesByPokerId = async (req, res) => {
  const pokerId = req.params.pokerId

  const poker = await Poker.findByPk(pokerId)

  if (poker) {
    const stories = await poker.getAllStories()
    res.status(200).send(stories)
  } else {
    res.status(500).send({ error: true, message: `Error para retornar stories do projeto=${pokerId}` })
  }
}
