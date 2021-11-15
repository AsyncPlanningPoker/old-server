const verifyJwt = require('../middlewares/verifyJwt')
const router = require('express').Router()
const userController = require('../controllers/userController')

module.exports = app => {
  // New User
  router.post('/', userController.create)

  // Auth (user:pass)
  router.post('/auth', userController.authenticate)

  // Verify Email  (code)
   router.get('/verifyEmail/:code', userController.verifyEmail)

  // Recover User
  router.post('/recover', userController.recoverUser)

  // Recover User Confirmation
  router.post('/recover/confirmation', userController.recoverUserConfirmation)

  router.use(verifyJwt)
  // Get User (id)
  router.get('/:id', userController.findOne)

  app.use('/api/users', router)
}
