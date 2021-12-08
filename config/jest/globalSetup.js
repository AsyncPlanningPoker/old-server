const db = require("../../database/models")

module.exports = async () => await db.sequelize.sync({ force: true })