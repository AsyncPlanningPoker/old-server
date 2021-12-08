const { validate: uuidValidate } = require('uuid')

expect.extend({
  toBeUUID(received) {
    const messageSucess = `expected ${received} is uuid valid`
    const messageError = `expected ${received} is not uuid valid`

    const pass = uuidValidate(received)

    const response = {
      pass,
      message: pass ? messageSucess : messageError
    }

    return response
  }
})
