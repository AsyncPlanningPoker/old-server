const jwt = require('jsonwebtoken'); // JSON Web Token Module
const secret = 'planning-poker-secret'

// "Authorization: Bearer ${}"

module.exports = 
function (req, res, next) {
    const token = req.headers["Authorization"];
    jwt.verify(token, secret, (err, decoded) => {
      if (err) res.status(401)
      next()
    })
  }