const dbConfig = require('../db-config/db.config')

const Sequelize = require('sequelize')
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

// Tables definidas aqui (db.tablename = model.js)
db.users = require('./UserModel.js')(sequelize, Sequelize)
db.pokers = require('./PokerModel.js')(sequelize, Sequelize)
db.stories = require('./StorieModel.js')(sequelize, Sequelize)

module.exports = db
