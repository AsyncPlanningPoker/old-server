const verifyJwt = require('../middlewares/verifyJwt')
const storyController = require('../controllers/storyController')
const router = require('express').Router()

module.exports = app => {
  // router.use(verifyJwt)

  // New Story
  router.post('/', storyController.create)

  app.use('/api/story', router)
}
