const db = require('../database/models')
const jwt = require('jsonwebtoken') // JSON Web Token Module
const secret = 'planning-poker-secret'
const Users = db.users

exports.create = (req, res) => {
  if (!req.body.username && !req.body.password && !req.body.email) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const userData = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email
  }

  Users.create(userData)
    .then(data => {
      res.status(201).json({ success: true })
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send({ error: true, message: 'Erro ao criar o usuário.' })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Users.findByPk(id)
    .then(data => {
      if (data) {
        const { id, name, email } = data
        res.send(200).json({ id, name, email })
      } else {
        res.status(404).send({ error: true, message: `Não foi possível localizar o usuário com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: `Error para retornar o usuário com o id=${id}` })
    })
}

exports.authenticate = (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

  Users.findOne({ where: { email, password } })
    .then(data => {
      if (data) {
        // JWT
        const token = jwt.sign({ name, email }, secret, { expiresIn: '12h' })
        res.status(200).json({ token })
      } else {
        res.status(404).json({ error: true, message: `Não foi possível autenticar o usuário=${name}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: true, message: `Erro ao localizar o usuário ${name} no banco de dados.` })
    })
}
