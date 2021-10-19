module.exports = (sequelize, Sequelize) => {
  const Story = sequelize.define('stories', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
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
