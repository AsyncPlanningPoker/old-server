const router = require('express').Router()
const userController = require('../controllers/userController')

module.exports = app => {
  // New User
  router.post('/', userController.create)

  // All Users
  router.get('/', userController.findAll)

  // Get User (id)
  router.get('/:id', userController.findOne)

  // Update User(id)
  router.put('/:id', userController.update)

  // Delete User(id)
  router.delete('/:id', userController.delete)

  // Auth (user:pass)
  router.post('/auth', userController.authenticate)

  app.use('/api/users', router)
}
