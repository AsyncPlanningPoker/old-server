const db = require('../models/sequelizeConfig')
const jwt = require('jsonwebtoken') // JSON Web Token Module
const secret = 'planning-poker-secret'
const Pokers = db.pokers
const bcrypt = require('bcrypt');

exports.create = (req, res) => {
    res.send({ message: 'Request precisa incluir user,pass e email!' })
  }
  