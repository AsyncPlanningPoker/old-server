module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    verifiedEmail: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    verifyEmailCode: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    }
  })
  return User
}
