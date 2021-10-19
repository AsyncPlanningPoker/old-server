const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const db = require('./database/models')
const PORT = process.env.PORT || 3000
const app = express()

app.set('json spaces', 2)
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Lista de Routes
require('./routes/sign-in.routes')(app)
require('./routes/story.routes')(app)

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running!' })
})

db.sequelize.authenticate().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
}).catch(err => {
  console.error('Unable to connect to the database:', err)
})

// for test
module.exports = app
