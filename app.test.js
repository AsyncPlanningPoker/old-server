const request = require('supertest')
const app = require('./app')

describe('Health Check', () => {
  it('Get health route', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
  })
})

describe('Users', () => {
  let userId = null
  
  it('Create', async () => {
    const response = await request(app).post('/api/users').send({ name: 'ufabc', password: 'ufabc', email: 'ufabc@ufabc.com' })
    
    userId = response.body.id
    const expectedObject =  { success: true, id: userId }
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject(expectedObject)
  })

  it('Find One', async () => {
    const route = `/api/users/${userId}`
    const response = await request(app).get(route)

    const expectedObject =  { name: 'ufabc', email: 'ufabc@ufabc.com' }
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(expectedObject)
  })

  it('Auth', async () => {
    const response = await request(app).post('/api/users/auth')
    .send({ name: 'ufabc', email: 'ufabc@ufabc.com' ,password: 'ufabc'})
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })
})
