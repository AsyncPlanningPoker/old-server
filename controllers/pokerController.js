const db = require('../database/models')
const Poker = db.pokers
const Users = db.users
const PokerUser = db.pokerUsers
const Stories = db.stories
const Round = db.rounds
const Vote = db.votes


exports.create = async (req, res) => {
  const idUser = req.decoded.userId
  if (!req.body.name && !idUser) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const user = await Users.findByPk(idUser)
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
  } else {
    res.status(500).send({ error: true, message: 'Erro ao criar o poker.' })
  }
}

exports.addUser = async (req, res) => {
  if (!req.body.idPoker && !req.body.email) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const user = await Users.findOne({ where: { email: req.body.email } })

  const poker = await Poker.findByPk(req.body.idPoker)
  if (user && poker) {
    const pokerUserData = {
      idUser: user.id,
      idPoker: poker.id
    }

    const userHasAssoc = await PokerUser.findOne({ where: pokerUserData })

    if (userHasAssoc) res.status(405).json({ error: true, message: 'Usuário já faz parte do poker.' })

    const addPokerUser = await PokerUser.create(pokerUserData)
    if (addPokerUser) {
      res.status(201).json({ success: true, id: addPokerUser.id })
    } else {
      res.status(405).send({ error: true, message: 'Erro ao associar usuario ao poker.' })
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
    const data = poker.map((key, index) => {
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
      allPokers.map(async (poker, index) => {
        const userCreateBy = await Users.findByPk(poker.dataValues.createdBy)
        const usersOfPoker = await poker.getAllUsers();

        const usersEmail = usersOfPoker.map((userPoker, index) => {
          return userPoker.email
        })

        return {
          idPoker: poker.dataValues.id,
          name: poker.dataValues.name,
          createdBy: userCreateBy.name,
          createdByEmail: userCreateBy.email,
          status: poker.dataValues.status,
          players: usersEmail
        }

      })
    )
    res.status(200).send(data)
  } else {
    res.status(500).send({ error: true, message: `Error para retornar pokers para o usuario=${idUser}` })
  }
}

exports.deletePoker = async (req, res) => {
  const id = req.params.id
  const idUser = req.decoded.userId

  const poker = await Poker.findByPk(id)

  if (poker && poker.createdBy == idUser) {
    const deletedPoker = Poker.destroy({ where: { id: poker.id } })
    if (deletedPoker) {
      res.sendStatus(200)
    } else {
      res.status(404).send({ error: true, message: `Não foi possível localizar o poker com o id=${id}.` })
    }
  } else {
    res.status(500).send({ error: true, message: `Error para deletar o poker com o id=${id}` })
  }
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

exports.getPokerResultByPokerId = async (req, res) => {
  const pokerId = req.params.id
  //const poker = await Poker.findByPk(pokerId)
  var poker = null
  try {
    poker = await Poker.findByPk(pokerId, {
      include: [{
        model: Stories,
        as: 'allStories',
        include: [{
          model: Round,
          as: 'allRounds',
          include: [{
            model: Vote,
            as: 'vote',
          }]
        }]
      }]
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: true, message: `Error para retornar o resultado` })
    return
  }

  try {
    const result = { stories: [] };
    poker.allStories.forEach(story => {
      var resultStory = {
        id: story.id,
        name: story.name,
        description: story.description,
        voteCount: 0,
        voteTotal: 0,
        voteAverage: 0,
        voteMedian: 0,
        voteMin: 99999,
        voteMax: 0,
        votes: []
      }
      story.allRounds.forEach(round => {
        console.log(round)
        if (round.vote.vote) {
          resultStory.voteCount++
          resultStory.voteTotal += round.vote.vote
          if (round.vote.vote > resultStory.voteMax) {
            resultStory.voteMax = round.vote.vote
          }
          if (round.vote.vote < resultStory.voteMin) {
            resultStory.voteMin = round.vote.vote
          }
          resultStory.votes.push({ vote: round.vote.vote, comment: round.vote.comment })
        }
      })
      if (resultStory.voteCount > 0) {
        // average
        resultStory.voteAverage = resultStory.voteTotal / resultStory.voteCount

        //median
        var auxiliarMedianArray = []
        resultStory.votes.forEach(v => { auxiliarMedianArray.push(v.vote) })
        resultStory.voteMedian = median(auxiliarMedianArray)
      }
      result.stories.push(resultStory)
    })
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: true, message: `Erro processando resultado` })
    return
  }
}

function median(values){
  if(values.length ===0) throw new Error("No inputs");

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);
  
  if (values.length % 2)
    return values[half];
  
  return (values[half - 1] + values[half]) / 2.0;
}
