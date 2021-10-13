const router = require('express').Router()
const userController = require('../controllers/userController')

module.exports = app => {
  // New User
  router.post('/', userController.create)

  // Get User (id)
  router.get('/:id', userController.findOne)

  // Auth (user:pass)
  router.post('/auth', userController.authenticate)

  app.use('/api/users', router)
}
