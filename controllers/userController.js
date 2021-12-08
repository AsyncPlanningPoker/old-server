const jwt = require("jsonwebtoken") // JSON Web Token Module
const Sequelize = require('sequelize');
const bcrypt = require("bcrypt")
const randomstring = require("randomstring")

const db = require("../database/models")
const mailService = require("../services/MailService")

const secret = "planning-poker-secret"
const Users = db.users
const UsersRecovery = db.userRecovery

const { Op } = Sequelize

exports.create = (req, res) => {
  if (!req.body.username && !req.body.password && !req.body.email) {
    res
      .status(405)
      .send({ error: true, message: "Erro no corpo da requisição." })
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
      mailService.sendMail(
        data.dataValues.email,
        "Verifique seu email",
        "generic",
        {message : `Clique aqui para verificar seu email: http://localhost:3000/api/users/verifyEmail/${data.dataValues.verifyEmailCode}`}
      );
      res.status(201).json({ success: true, id: userId })
    })
    .catch(err => {
      res
        .status(500)
        .send({ error: true, message: "Erro ao criar o usuário." })
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
        res
          .status(404)
          .json({
            error: true,
            message: `Não foi possível localizar o usuário com o id=${id}.`
          })
      }
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({
          error: true,
          message: `Error para retornar o usuário com o id=${id}`
        })
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
          res.status(404).json({ error: true, message: "Senha inválida" })
        } else if (needsVerifiedEmail && !user.verifiedEmail) {
          // Check for verified email
          res
            .status(404)
            .json({ error: true, message: "Usuário com email não verificado" })
        } else {
          // JWT
          const name = user.name
          const token = jwt.sign({ name, email, userId: user.id }, secret, {
            expiresIn: "12h"
          })
          res.status(200).json({ token })
        }
      } else {
        res
          .status(404)
          .json({
            error: true,
            message: `Não foi possível autenticar o usuário=${email}.`
          })
      }
    })
    .catch((err) => {
      console.log(err)
      res
        .status(500)
        .json({
          error: true,
          message: `Erro ao localizar o usuário ${email} no banco de dados.`
        })
    })
}

exports.verifyEmail = (req, res) => {
  const code = req.params.code

  Users.findOne({ where: { verifyEmailCode: code } })
    .then((data) => {
      if (data) {
        if (data.dataValues.verifiedEmail) {
          res.status(400).json({ error: true, message: `Email já verificado` })
        } else {
          data
            .update({ verifiedEmail: true })
            .then(data => {
              res.status(200).json({ message: "Email confirmado com sucesso" })
            })
            .catch(err => {
              res.status(500).json({ message: "Falha ao atualizar usuário" })
            })
        }
      } else {
        res
          .status(404)
          .json({
            error: true,
            message: `Não foi possível localizar o usuário`
          })
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: true, message: `Error para encontrar o usuário` })
    })
}


exports.recoverUser = (req, res) => {
  const email = req.body.email

  Users.findOne({ where: { email: email } })
    .then(data => {
      if (data) {
        const userRecoveryData = {
          token: randomstring.generate(64),
          status: "Pending",
          userId: data.dataValues.id
        };

        UsersRecovery.create(userRecoveryData)
          .then((recoveryData) => {
            const token = recoveryData.dataValues.token
            mailService.sendMail(
              data.dataValues.email,
              "Recuperação de usuário",
              "reset-password",
              {token, username: data.name}
            );
            res.status(201).json({ success: true })
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .send({
                error: true,
                message: "Erro ao criar recuperação de senha"
              })
          })
      } else {
        res
          .status(404)
          .json({
            error: true,
            message: `Não foi possível localizar o usuário`
          })
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: true, message: `Error para encontrar o usuário` })
    })
};

exports.recoverUserConfirmation = (req, res) => {
  const token = req.body.token
  const newPassword = req.body.newPassword
  const salt = bcrypt.genSaltSync()
  const passwordHash = bcrypt.hashSync(newPassword, salt)

  UsersRecovery.findOne({ where: { token: token }, include: "user" })
    .then(data => {
      if (data) {
        if (data.dataValues.status === "Pending") {
          data
            .update({ status: "Complete" })
            .then(updatedRecovery => {
              console.log("recovery updated to complete");
              data.dataValues.user
                .update({ salt: salt, password: passwordHash })
                .then(updatedUser => {
                  res.status(200).json({ message: "Atualizado com sucesso" })
                })
                .catch(err => {
                  res
                    .status(500)
                    .json({ message: "Falha ao atualizar usuário" })
                })
            })
            .catch(err => {
              res
                .status(500)
                .json({ message: "Falha ao atualizar recuperação" })
            })
        } else {
          res
            .status(404)
            .json({ error: true, message: `Token não está mais disponível` })
        }
      } else {
        res
          .status(404)
          .json({ error: true, message: `Não foi possível localizar o token` })
      }
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ error: true, message: `Error para encontrar o token` })
    })
}


exports.autoCompleteEmail = async (req, res) => {
  const partial = req.query.partial

  if (partial && typeof partial === 'string') {
    const emailsResult = await Users.findAll({
      limit: 3,
      where: {
        email: {
          [Op.regexp]: `^${partial}[\S]*`
        }
      },
      attributes: ['email']
    }) 
  
    if (emailsResult) {
      const emails = emailsResult.map((emailObject) => {
        return emailObject.email
      })
      res.status(200).send(emails)
    } else {
      res.status(500).send({ error: true, message: `Error ao buscar usuário` })
    }
  } else {
    res.status(405).send({ error: true, message: 'Erro no corpo da requisição.' })
  }

}