const paths = {
  development: '.env',
  test: '.env',
}
const env = process.env.NODE_ENV || 'development'

require('dotenv').config({ path: paths[env] })

const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 5432;
const password = process.env.DB_PASSWORD || "password";
const username = process.env.DB_USERNAME || "postgres";
const database = process.env.DB_NAME || "planning-poker-dev";
const isHerokuDb = !!process.env.IS_HEROKU_DB 

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    port,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: isHerokuDb && {
      ssl: {
         require: true,
         rejectUnauthorized: false,
      },
    },
  },
  test: {
    host: 'localhost',
    port: 5432,
    password: 'password',
    username: 'postgres',
    database: 'planning-poker-dev',
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    protocol: 'postgres',
    url: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: process.env.TZ || 'America/Sao_Paulo'
  }
}
