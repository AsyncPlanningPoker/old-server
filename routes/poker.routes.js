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
  //router.get('/createdByUser', pokerController.createdByUser)

  // Get Pokers for a given idUser (uuid)
  router.get('/fromUser', pokerController.fromUser)

  // Get users for a given idPoker (uuid)
  router.get('/:pokerId/playersByPoker', pokerController.pokerPlayersById)

  // Get users for a given idPoker (uuid)
  router.put('/:pokerId/closePoker', pokerController.closePoker)

  // Put close all rounds opened by idPoker
  router.put('/:pokerId/closeAllRounds', pokerController.closeAllRounds)

  // Get users for a given idPoker (uuid)
  //router.put('/:pokerId/renamePoker', pokerController.renamePoker)

  // Get Poker (uuid)
  router.get('/:id', pokerController.findOne)

  // Get All stories for a given pokerId
  router.get('/:pokerId/stories', pokerController.findStoriesByPokerId)

  // Delete Poker (uuid)
  router.delete('/:id', pokerController.deletePoker)

  //Poker Result (uuid)
  router.get('/result/:id', pokerController.getPokerResultByPokerId)

  app.use('/api/poker', router)
}
