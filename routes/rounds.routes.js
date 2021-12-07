const verifyJwt = require('../middlewares/verifyJwt')
const voteController = require('../controllers/roundController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)

  router.get('/:idRound', voteController.getRoundResult)

  router.post('/:idRound/next', voteController.createNexRound)

  app.use('/api/round', router)
}