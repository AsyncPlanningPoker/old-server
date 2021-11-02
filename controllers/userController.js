const db = require('../database/models')
const mailService = require('../services/MailService')
const jwt = require('jsonwebtoken') // JSON Web Token Module
const secret = 'planning-poker-secret'
const Users = db.users
const bcrypt = require('bcrypt')
const randomstring = require("randomstring")

exports.create = (req, res) => {
  if (!req.body.username && !req.body.password && !req.body.email) {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(req.body.password, salt)

  const userData = {
    name: req.body.name,
    password: passwordHash,
    email: req.body.email,
    verifyEmailCode: randomstring.generate(64),
    salt: salt
  }

  Users.create(userData)
    .then(data => {
      const userId = data.dataValues.id
      mailService.sendMail(data.dataValues.email, "Verifique seu email", `Clique aqui para verificar seu email: http://localhost:3000/api/users/verifyEmail/${data.dataValues.verifyEmailCode}`);
      res.status(201).json({ success: true, id: userId })
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({ error: true, message: 'Erro ao criar o usuário.' })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Users.findByPk(id)
    .then(data => {
      if (data) {
        const { id, name, email } = data
        res.status(200).json({ id, name, email })
      } else {
        res.status(404).json({ error: true, message: `Não foi possível localizar o usuário com o id=${id}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: true, message: `Error para retornar o usuário com o id=${id}` })
    })
}

exports.authenticate = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const needsVerifiedEmail = false

  Users.findOne({ where: { email } })
    .then(data => {
      if (data) {
        const user = data.dataValues
        // Check Password
        const hashPassword = bcrypt.hashSync(password, user.salt)
        if (user.password !== hashPassword) {
          res.status(404).json({ error: true, message: 'Senha inválida' })
        } else if (needsVerifiedEmail && !user.verifiedEmail){
          // Check for verified email
          res.status(404).json({ error: true, message: 'Usuário com email não verificado' })
        } else {
          // JWT
          const name = user.name
          const token = jwt.sign({ name, email }, secret, { expiresIn: '12h' })
          res.status(200).json({ token })
        }
      } else {
        res.status(404).json({ error: true, message: `Não foi possível autenticar o usuário=${email}.` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: true, message: `Erro ao localizar o usuário ${email} no banco de dados.` })
    })
}

exports.verifyEmail = (req, res) => {
  const code = req.params.code

  Users.findOne({ where: { verifyEmailCode: code } })
    .then(data => {
      if (data) {
        if (data.dataValues.verifiedEmail) {
          res.status(400).json({ error: true, message: `Email já verificado` })
        } else {
          data.update({ verifiedEmail: true }).then(data => {
            res.status(200).json({ message: 'Email confirmado com sucesso' })
          }).catch(err => {
            res.status(500).json({ message: 'Falha ao atualizar usuário' })
          })
        }
      } else {
        res.status(404).json({ error: true, message: `Não foi possível localizar o usuário` })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: true, message: `Error para encontrar o usuário` })
    })
}
