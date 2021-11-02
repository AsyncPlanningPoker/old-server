const router = require('express').Router()
const userController = require('../controllers/userController')

module.exports = app => {
  // New User
  router.post('/', userController.create)

  // Get User (id)
  router.get('/:id', userController.findOne)

  // Auth (user:pass)
  router.post('/auth', userController.authenticate)

  // Verify Email  (code)
   router.get('/verifyEmail/:code', userController.verifyEmail)

  app.use('/api/users', router)
}
