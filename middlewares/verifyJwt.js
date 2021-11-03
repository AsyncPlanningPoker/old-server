const jwt = require('jsonwebtoken') // JSON Web Token Module
const secret = 'planning-poker-secret'

module.exports =
function (req, res, next) {
  const authorization = req.get('Authorization')
  // Authorization: token
  // Authorization: Bearer <Token>
  if (authorization) {
    jwt.verify(authorization, secret, (err, decoded) => {
      req.decoded = decoded
      if (err) {
        res.status(401).json({ error: true, errorMessage: 'Invalid Token' })
      } else next()
    })
  } else {
    res.status(401).json({ error: true, errorMessage: 'Missing authorization token' })
  }
}
