const request = require('supertest')
const app = require('./app')

describe('Health Check', () => {
  it('Get health route', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message', 'Server is running!')
  })
})

// describe('Poker', () => {
//   it('All stories', async () => {
//     // Find all stories from an poker
//     const route = `/api/poker/${pokerId}/stories`
//     const response = await request(app)
//       .get(route)
//       .set({Authorization: userJwt})
    
//     expect(response.status).toBe(200)
//   })

// })


// describe('Votes', () => {
//   it('Get vote', async () => {
//     // Find vote
//     const route = `/api/vote/${voteId}`
//     const response = await request(app)
//       .get(route)
//       .set({Authorization: userJwt})
    
//     expect(response.status).toBe(200)
//   })
// })

// describe('Delete', () => {
//   it('Vote', async () => {
//     const response = await request(app)
//       .delete('/api/vote')
//       .set({Authorization: userJwt})
//       .send({ idUser: userId, idPoker: pokerId })
    
//     expect(response.status).toBe(200)
//   })
  
//   it('Story', async () => {
//     // Delete storie
//     const route = `/api/story/${storyId}`
//     const response = await request(app)
//       .delete(route)
//       .set({Authorization: userJwt})

//     expect(response.status).toBe(200)
//   })
  
//   it('Poker', async () => {
//     // Find all stories from an poker
//     const route = `/api/poker/${pokerId}`
//     const response = await request(app)
//       .delete(route)
//       .set({Authorization: userJwt})
    
//     expect(response.status).toBe(200)
//   })

// })
