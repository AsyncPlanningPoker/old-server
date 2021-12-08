const faker = require('faker')
const bcrypt = require("bcrypt")
const randomstring = require("randomstring")

faker.locale = 'pt_BR'

const pokerFaker = (attrs = {}) => {

  const response = {
    name: faker.lorem.words(),
    description: faker.datatype.boolean ? "Open" : "Closed",
  }

  return {...response, ...attrs }
}

const storyFaker = (attrs = {}) => {

  const response = {
    name: faker.lorem.words(),
    description: faker.lorem.text(),
  }

  return {...response, ...attrs }
}


const userFaker = (attrs = {}) => {
  
  const salt = bcrypt.genSaltSync()
  const password = bcrypt.hashSync(attrs.password || faker.internet.password(), salt)

  const response = {
    name: faker.internet.userName(),
    email: faker.internet.email(),
    verifiedEmail: false,
    verifyEmailCode: randomstring.generate(64),
    salt
  }

  return {...response, ...attrs, password }
}

module.exports = {
  pokerFaker,
  storyFaker,
  userFaker
};
