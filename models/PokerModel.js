module.exports = (sequelize, Sequelize) => {
    const Poker = sequelize.define('pokers', {
      name: {
        type: Sequelize.STRING
      },
      createBy: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('opened','finished')
      }
    })
    return Poker
  }
  