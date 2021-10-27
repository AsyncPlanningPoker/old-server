const verifyJwt = require('../middlewares/verifyJwt')
const voteController = require('../controllers/voteController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)

  // Cast a Vote
  router.post('/', voteController.create)

  // Get Vote (uuid)
  router.get('/:id', voteController.findOne)

  // Delete Vote (pokerId + userId)
  router.delete('/', voteController.deleteVote)

  // Delete Vote (pokerId)
  router.delete('/deletePoker/:id', voteController.deletePoker)

  // Delete Vote (userId)
  router.delete('/deleteUser/:id', voteController.deleteUser)

  // Delete Vote (storyId)
  router.delete('/deleteStory/:id', voteController.deleteStory)

  app.use('/api/vote', router)
}
