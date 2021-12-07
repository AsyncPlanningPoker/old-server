const verifyJwt = require('../middlewares/verifyJwt')
const voteController = require('../controllers/voteController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)

  router.put('/:idVote', voteController.voteRound)

  app.use('/api/vote', router)
}
