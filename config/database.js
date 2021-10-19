module.exports = {
  development: {
    host: 'localhost',
    port: 5432,
    password: 'password',
    username: 'postgres',
    database: 'planning-poker-dev',
    dialect: 'postgres',
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
