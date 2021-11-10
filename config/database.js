module.exports = {
  development: {
    username: "vlrcnroabxpqmi",
    password: "b236c187e9a1d9795b9065140353ef8bdcdcbfab6a7056013a9c2dfd697d5d58",
    database: "db6tk8h0iffb26",
    host: "ec2-52-87-123-108.compute-1.amazonaws.com",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
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
