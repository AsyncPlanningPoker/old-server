module.exports = (sequelize, Sequelize) => {
  const Story = sequelize.define('stories', {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    idPoker: {
      type: Sequelize.STRING
    }
  })
  return Story
}
