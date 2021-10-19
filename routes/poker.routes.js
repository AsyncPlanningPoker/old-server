const verifyJwt = require('../middlewares/verifyJwt')
const pokerController = require('../controllers/pokerController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)
  // New Poker
  router.post('/', pokerController.create)

  // Get Poker (uuid)
  router.get('/:id', pokerController.findOne)

  // Get All stories for a given pokerId
  router.get('/:pokerId/stories', pokerController.findStoriesByPokerId)

  // Delete Poker (uuid)
  router.delete('/:id', pokerController.deletePoker)

  app.use('/api/poker', router)
}
