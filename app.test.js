const request = require('supertest')
const app = require('./app')
const db = require('./models/sequelizeConfig')

describe('Health Check', () => {
  it('Get health route', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
  })
})

describe('Users', () => {

  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
  })
  
  it('Create', async () => {
    const response = await request(app).post('/api/users').send({ name: 'test', password: 'test', email: 'test' })
    const expectedObject =  { success: true }
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject(expectedObject)

  })

  it('Find One', async () => {
    const response = await request(app).get('/api/users/1')
    const expectedObject =  { name: 'test', email: 'test' }
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(expectedObject)
  })

  it('Auth', async () => {
    const response = await request(app).post('/api/users/auth')
    .send({ name: 'test', email: 'test' ,password: 'test'})
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

})
