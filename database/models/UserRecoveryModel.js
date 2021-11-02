module.exports = (sequelize, Sequelize) => {
    const UserRecovery = sequelize.define('userRecovery', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Complete', 'Canceled', 'Expired')
      }
    })

    UserRecovery.associate = db => {
        db.userRecovery.belongsTo(db.users, { as: "user" })
      }

    return UserRecovery
  }