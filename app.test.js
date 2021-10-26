const request = require('supertest')
const app = require('./app')
const db = require('./database/models')

let userId, userJwt
let pokerId
let storyId

// Before any tests run, clear the DB and run migrations with Sequelize sync()
beforeAll(async () => {
  await db.sequelize.sync({ force: true })
})

describe('Health Check', () => {
  it('Get health route', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
  })
})

describe('Users', () => {
  

  it('Create', async () => {
    // Creates an user
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'ufabc', password: 'ufabc', email: 'ufabc@ufabc.com' })
    
      // Storing userId
    userId = response.body.id
    
    // Expected response from route
    const expectedObject =  { success: true, id: userId }
    
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject(expectedObject)
  })

  it('Find One', async () => {
    // Find specific user
    const route = `/api/users/${userId}`
    const response = await request(app)
      .get(route)
    
    // Expected response from route
    const expectedObject =  { name: 'ufabc', email: 'ufabc@ufabc.com' }
    
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(expectedObject)
  })

  it('Auth', async () => {
    // Auth user
    const response = await request(app)
      .post('/api/users/auth')
      .send({ email: 'ufabc@ufabc.com', password: 'ufabc'})
    
    // Storing token
    userJwt = response.body.token

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })
})

describe('Poker', () => {
  it('Create', async () => {
    // Creat Poker
    const response = await request(app)
      .post('/api/poker')
      .set({Authorization: userJwt})
      .send({ name: 'LabES', createdBy: 'Gabriel'})
      
    // Storing token
    pokerId = response.body.id
    
    // Expected response from route
    const expectedObject =  { success: true, id: pokerId }
      
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject(expectedObject)
  })
  
  it('Find One', async () => {
    // Find specific poker
    const route = `/api/poker/${pokerId}`
    const response = await request(app)
      .get(route)
      .set({Authorization: userJwt})
    
    expect(response.status).toBe(200)
  })

  it('All stories', async () => {
    // Find all stories from an poker
    const route = `/api/poker/${pokerId}/stories`
    const response = await request(app)
      .get(route)
      .set({Authorization: userJwt})
    
    expect(response.status).toBe(200)
  })

})

describe('Stories', () => {
  it('Create', async () => {
    const response = await request(app)
    .post('/api/story/')
    .set({Authorization: userJwt})
    .send({ name: 'LabES', description: 'LabEs', idPoker: pokerId })

    // Storing token
    storyId = response.body.id
    
    // Expected response from route
    const expectedObject =  { success: true, id: storyId }

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject(expectedObject)
  })

  it('Find One', async () => {
    // Find specific story
    const route = `/api/story/${storyId}`
    const response = await request(app)
      .get(route)
      .set({Authorization: userJwt})
    
    expect(response.status).toBe(200)
  })

})

describe('Delete', () => {
  it('Story', async () => {
    // Delete storie
    const route = `/api/story/${storyId}`
    const response = await request(app)
      .delete(route)
      .set({Authorization: userJwt})
    
    console.log(response.body)

    expect(response.status).toBe(200)
  })
  
  it('Poker', async () => {
    // Find all stories from an poker
    const route = `/api/poker/${pokerId}`
    const response = await request(app)
      .delete(route)
      .set({Authorization: userJwt})
    
    expect(response.status).toBe(200)
  })

})
