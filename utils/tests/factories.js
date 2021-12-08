const { factory } = require('factory-girl')
const randomstring = require("randomstring")

const db = require("../../database/models");
const {
  pokerFaker,
  storyFaker,
  userFaker,
} = require('./fakers')

const Users = db.users;
const UsersRecovery = db.userRecovery
const Poker = db.pokers
const PokerUser = db.pokerUsers
const Stories = db.stories

factory.define('users', Users, (attrs) =>
  userFaker(attrs)
)

factory.define('pokers', Poker, (attrs) =>
  pokerFaker({ 
    createdBy: factory.assoc('users', 'id'),
    ...attrs
  })
)

factory.define('stories', Stories, (attrs) =>
  storyFaker({ 
    idPoker: factory.assoc('pokers', 'id'),
    ...attrs
  })
)

factory.define('pokerUsers', PokerUser, (attrs) =>
  ({
    idUser: factory.assoc('users', 'id'),
    idPoker: factory.assoc('pokers', 'id'),
    ...attrs
  })
)


factory.define('userRecovery', UsersRecovery, (attrs) =>
  ({
    userId: factory.assoc('users', 'id'),
    token: randomstring.generate(64),
    status: "Pending"
  })
)

module.exports = factory
