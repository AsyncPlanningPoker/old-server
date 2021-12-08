const request = require("supertest")
const uuid = require("uuid")

const app = require("../app")
const db = require("../database/models")
const fakers = require("../utils/tests/fakers")
const factories = require("../utils/tests/factories")
const { generateToken } = require("../utils")

const Users = db.users
const secret = "planning-poker-secret"

describe("User controller", () => {
  describe("Create user", () => {
    it("should be able create new user when given valid datas", async () => {
      const payload = fakers.userFaker({})

      // Creates an user
      const response = await request(app).post("/api/users").send(payload)

      // Storing userId
      userId = response.body.id

      // Expected response from route
      const expectedObject = { success: true, id: userId }

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should return status code 405 when no send body data", async () => {
      const response = await request(app).post("/api/users").send({})

      const expectedObject = {
        error: true,
        message: "Erro no corpo da requisição."
      }

      expect(response.status).toBe(405)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should not be ble creata two user with same email", async () => {
      const payload = fakers.userFaker({})

      await Users.create(payload)

      const response = await request(app).post("/api/users").send(payload)

      const expectedObject = {
        error: true,
        message: "Erro ao criar o usuário."
      }

      expect(response.status).toBe(500)
      expect(response.body).toMatchObject(expectedObject)
    })
  })

  describe("Get user by id", () => {
    it("should be able find a user when give a valid user id", async () => {
      const userCreated = await factories.create("users")

      const token = generateToken(userCreated)

      const response = await request(app)
        .get(`/api/users/${userCreated.id}`)
        .set("Authorization", `Bearer ${token}`)

      const expectedObject = {
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email
      }

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should not be able find a user when give a invalid user id", async () => {
      const userCreated = await factories.create("users")

      const token = generateToken(userCreated)

      const userIdInvalid = uuid.v4()

      const response = await request(app)
        .get(`/api/users/${userIdInvalid}`)
        .set("Authorization", `Bearer ${token}`)

      const expectedObject = {
        error: true,
        message: `Não foi possível localizar o usuário com o id=${userIdInvalid}.`
      }

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should return a error when not given a user id", async () => {
      const userCreated = await factories.create("users")

      const token = generateToken(userCreated)

      const userIdInvalid = "not is uuid"

      const response = await request(app)
        .get(`/api/users/${userIdInvalid}`)
        .set("Authorization", `Bearer ${token}`)

      const expectedObject = {
        error: true,
        message: `Error para retornar o usuário com o id=${userIdInvalid}`
      }

      expect(response.status).toBe(500)
      expect(response.body).toMatchObject(expectedObject)
    })
  })

  describe("Authenticate", () => {
    it("should return a token", async () => {
      const { password, salt } = fakers.userFaker({ password: "123" })

      const userCreated = await factories.create("users", { password, salt })

      const payload = {
        email: userCreated.email,
        password: "123"
      }

      const response = await request(app).post("/api/users/auth").send(payload)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
    })

    it("should return status code 404 when not find user with given email", async () => {
      const payload = {
        email: "no_created@mail.com",
        password: "123"
      }

      const response = await request(app).post("/api/users/auth").send(payload)

      const expectedObject = {
        error: true,
        message: `Não foi possível autenticar o usuário=${payload.email}.`
      }

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should return status code 404 when given incorrect password", async () => {
      const { password, salt } = fakers.userFaker({ password: "123" })

      const userCreated = await factories.create("users", { password, salt })

      const payload = {
        email: userCreated.email,
        password: "12345"
      }

      const response = await request(app).post("/api/users/auth").send(payload)

      const expectedObject = { error: true, message: "Senha inválida" }

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should return status code 500 when no send body data", async () => {
      const response = await request(app).post("/api/users/auth").send({})

      const expectedObject = {
        error: true,
        message: "Erro ao localizar o usuário undefined no banco de dados."
      }

      expect(response.status).toBe(500)
      expect(response.body).toMatchObject(expectedObject)
    })
  })

  describe("verify email", () => {
    it("should be able verify email", async () => {
      const userCreated = await factories.create("users")

      const response = await request(app).get(
        `/api/users/verifyEmail/${userCreated.verifyEmailCode}`
      )

      const expectedObject = { message: "Email confirmado com sucesso" }

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should not be able verify email when already verified", async () => {
      const userCreated = await factories.create("users", {
        verifiedEmail: true
      })

      const response = await request(app).get(
        `/api/users/verifyEmail/${userCreated.verifyEmailCode}`
      )

      const expectedObject = { error: true, message: `Email já verificado` }

      expect(response.status).toBe(400)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should return status code 404 when given code no match", async () => {
      const response = await request(app).get(
        "/api/users/verifyEmail/invalid_code"
      )

      const expectedObject = {
        error: true,
        message: "Não foi possível localizar o usuário"
      }

      expect(response.status).toBe(404)
      expect(response.body).toMatchObject(expectedObject)
    })
  })

  describe("Recover password", () => {
    it("should be able recover password", async () => {
      const userCreated = await factories.create("users")

      const response = await request(app)
        .post("/api/users/recover")
        .send({ email: userCreated.email })

      const expectedObject = { success: true }

      expect(response.status).toBe(201)
      expect(response.body).toMatchObject(expectedObject)
    })

    it("should be able reset password", async () => {
      const { token } = await factories.create("userRecovery")

      const response = await request(app)
        .post("/api/users/recover/confirmation")
        .send({ token, newPassword: "123456" })

      const expectedObject = { message: "Atualizado com sucesso" }

      expect(response.status).toBe(200)
      expect(response.body).toMatchObject(expectedObject)
    })
  })

  describe("Auto complete email", () => {
    beforeEach(async () => {
      await factories.createMany("users", 10)
    })

    it("should be able find email of users", async () => {
      const userCreated = await factories.create("users")

      const token = generateToken(userCreated)

      const response = await request(app)
        .get("/api/users/autoCompleteEmail")
        .set("Authorization", `Bearer ${token}`)
        .query({ partial: userCreated.email.slice(0, 2) })

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual(expect.any(Array))
    })

    it('should return status code 405 when no set query "partial"', async () => {
      const userCreated = await factories.create("users")

      const token = generateToken(userCreated)

      const response = await request(app)
        .get("/api/users/autoCompleteEmail")
        .set("Authorization", `Bearer ${token}`)

      const expectedObject = {
        error: true,
        message: "Erro no corpo da requisição."
      }

      expect(response.status).toBe(405)
      expect(response.body).toMatchObject(expectedObject)
    })
  })
})
