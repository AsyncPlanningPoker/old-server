const verifyJwt = require('../middlewares/verifyJwt')
const pokerController = require('../controllers/pokerController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)
  // New Poker
  router.post('/', pokerController.create)

  // New Poker
  router.post('/addUser', pokerController.addUser)

  // Get Pokers created by user (uuid)
  router.get('/createdByUser', pokerController.createdByUser)

  // Get Pokers created by user (uuid)
  router.get('/missingVotes', pokerController.findPokerWithMissingVotesByUser)

  // Get Pokers for a given idUser (uuid)
  router.get('/fromUser', pokerController.fromUser)

  // Get Poker (uuid)
  router.get('/:id', pokerController.findOne)

  // Get All stories for a given pokerId
  router.get('/:pokerId/stories', pokerController.findStoriesByPokerId)

  // Delete Poker (uuid)
  router.delete('/:id', pokerController.deletePoker)

  app.use('/api/poker', router)
}
