const verifyJwt = require('../middlewares/verifyJwt')
const storyController = require('../controllers/storyController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)
  // New Story
  router.post('/', storyController.create)

  // Get Story (uuid)
  router.get('/:id', storyController.findOne)

  // Delete Story (uuid)
  router.delete('/:id', storyController.deleteStory)

  app.use('/api/story', router)
}
