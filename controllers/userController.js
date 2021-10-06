const db = require("../models/sequelizeConfig");
const Users = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    const User = {
      name: req.body.name,
      password: req.body.password,
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

exports.findAll = (req, res) => {

  Users.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => { 
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Users."
        });
      });
  };

exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Users.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
      });
  };

exports.update = (req, res) => {
    const id = req.params.id;
  
    Users.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update User with id=${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating User with id=" + id
        });
      });
  };

exports.delete = (req, res) => {
    const id = req.params.id;
  
    Users.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  };

exports.authenticate = (req, res) => {
    const name = req.params.username;
    const password = req.params.password;

    Users.findOne({ where: { name: name , password : password} })
      .then(data => {
        if (data) {
          res.status(200).send({
            message: (data)
          });
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