module.exports = {
  HOST: "192.168.0.155",
  PORT: 5431,
  USER: "root",
  PASSWORD: "root",
  DB: "planning-poker-dev",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
