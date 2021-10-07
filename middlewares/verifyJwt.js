const jwt = require('jsonwebtoken') // JSON Web Token Module
const secret = 'planning-poker-secret'

module.exports =
function (req, res, next) {
  const authorization = req.headers.Authorization
  const token = authorization.split(' ')[1]
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: true, errorMessage: 'Invalid Token' })
    } else next()
  })
}
