const verifyJwt = require('../middlewares/verifyJwt')
const pokerControlle = require('../controllers/pokerController')
const router = require('express').Router()

module.exports = app => {
  router.use(verifyJwt)

  // New Poker
  router.post('/', pokerControlle.create)

  app.use('/api/poker', router)
}
