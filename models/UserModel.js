module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      name: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
    });
  
    return User;
  };