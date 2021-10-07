<<<<<<< HEAD
const db = require('../models/sequelizeConfig')
const jwt = require('jsonwebtoken') // JSON Web Token Module
const secret = 'planning-poker-secret'
const Users = db.users

exports.create = (req, res) => {
  if (!req.body.username && !req.body.password && req.body.email) {
    res.status(400).send({
      message: 'Request precisa incluir user,pass e email!'
    })
    return
  }
  const User = {
    name: req.body.username,
    password: req.body.password,
    email: req.body.email
  }
=======
const db = require("../models/sequelizeConfig");
const jwt = require('jsonwebtoken'); // JSON Web Token Module
const secret = 'planning-poker-secret'
const Users = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.username && !req.body.password && req.body.email) {
      res.status(400).send({
        message: "Request precisa incluir user,pass e email!"
      });
      return;
    }
  
    const User = {
      name: req.body.username,
      password: req.body.password,
      email: req.body.email
    };
  
    Users.create(User)
      .then(data => {
        res.send(data);})
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  };
>>>>>>> 61fe5ab2c6637baf9d37228ab4b4230c2e614534

  Users.create(User)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the User.'
      })
    })
}

exports.findAll = (req, res) => {
  Users.findAll()
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Users.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Users.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: 'Error retrieving User with id=' + id
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id

  Users.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: 'User was updated successfully.'
        })
      } else {
        res.send({
          message: `Cannot update User with id=${id}`
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: 'Error updating User with id=' + id
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Users.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: 'User was deleted successfully!'
        })
      } else {
        res.send({
          message: `Cannot delete User with id=${id}.`
        })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: 'Could not delete User with id=' + id
      })
    })
}

exports.authenticate = (req, res) => {
<<<<<<< HEAD
  const name = req.body.username
  const password = req.body.password

  Users.findOne({ where: { name, password } })
    .then(data => {
      if (data) {
        // JWT
        const token = jwt.sign({ name }, secret, { expiresIn: '12h' })
        res.status(200).json({ token })
      } else {
        res.status(404).send({
          message: `Cannot find User with name=${name} and password=${password}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving User with name=' + name + ' Error: ' + err
      })
    })
}
=======
    const name = req.body.username;
    const password = req.body.password;


    Users.findOne({ where: { name , password} })
      .then(data => {
        if (data) {
          //JWT
          const token = jwt.sign({name}, secret, {expiresIn: '12h'});
          res.status(200).json({ token });
        } else {
          
          res.status(404).send({
            message: `Cannot find User with name=${name} and password=${password}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with name=" + name + " Error: " + err
        });
      });
  };
>>>>>>> 61fe5ab2c6637baf9d37228ab4b4230c2e614534
