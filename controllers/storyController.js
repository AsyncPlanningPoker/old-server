// const db = require('../models/sequelizeConfig')
// const Users = db.users
// const Op = db.Sequelize.Op

exports.create = (req, res) => {
  res.send({ message: 'Request precisa incluir user,pass e email!' })
}
