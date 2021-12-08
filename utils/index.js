const jwt = require("jsonwebtoken"); // JSON Web Token Module

const secret = "planning-poker-secret";

const generateToken = (user) =>
  jwt.sign(
    {
      name: user.name,
      email: user.email,
      userId: user.id,
    },
    secret,
    {
      expiresIn: "12h",
    }
  );

module.exports = {
  generateToken,
};
