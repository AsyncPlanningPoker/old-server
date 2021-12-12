require("../utils/tests/jest/extends");
const request = require("supertest");

const app = require("../app");
const fakers = require("../utils/tests/fakers");
const factories = require("../utils/tests/factories");
const { generateToken } = require("../utils");


let token = null;
let userFactory = null;

beforeAll(async () => {
  userFactory = await factories.create("users");

  token = generateToken(userFactory);
});

describe("Poker controller", () => {
  describe("Create poker", () => {
    it("should be able crate a poker", async () => {
      const response = await request(app)
        .post("/api/poker")
        .set({ Authorization: `Bearer ${token}` })
        .send({ name: "Poker test contoller" });

      pokerId = response.body.id;

      const expectedObject = { success: true, id: pokerId };

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(expectedObject);
    });

    it("should not be able create a poker when no send name in body data", async () => {
      const response = await request(app)
        .post("/api/poker")
        .set({ Authorization: `Bearer ${token}` });

      const expectedObject = { error: true, message: "Erro ao criar o poker." };

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject(expectedObject);
    });
  });

  describe('Get poker', () => {
    
    it('should be able find poker by id', async () => {
      const pokerCreated = await factories.create("pokers");

      const response = await request(app)
      .get(`/api/poker/${pokerCreated.id}`)
      .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('data', expect.objectContaining({
        id: expect.toBeUUID(),
        name: expect.any(String),
        status: expect.stringMatching(/Open|Closed/),
        createdBy: expect.toBeUUID()
      }))
    });
  });
  

  describe("Add user", () => {
    it("should be able add user in poker", async () => {
      const pokerCreated = await factories.create("pokers", {
        createdBy: userFactory.id
      });
      const userCreated = await factories.create("users");

      const payload = {
        idPoker: pokerCreated.id,
        email: userCreated.email
      };

      const response = await request(app)
        .post("/api/poker/addUser")
        .set({ Authorization: `Bearer ${token}` })
        .send(payload);

      expect(response.status).toBe(201);
      expect(response).toHaveProperty(
        "body",
        expect.objectContaining({
          success: true,
          id: expect.toBeUUID()
        })
      );
    });
  });

  describe("Get pokers from user", () => {
    beforeAll(async () => {
      const pokersCreated = await factories.createMany("pokers", 3, {
        createdBy: userFactory.id
      });
      const { id: idUser } = await factories.create("users");

      await Promise.all(
        pokersCreated.map(
          async ({ id: idPoker }) =>
            await factories.create("pokerUsers", { idPoker, idUser })
        )
      );
    });

    it("should be able find all pokers that a user play", async () => {
      const response = await request(app)
        .get("/api/poker/fromUser")
        .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response).toHaveProperty("body", expect.any(Array));
      response.body.forEach((row) => {
        expect(row).toStrictEqual(
          expect.objectContaining({
            idPoker: expect.toBeUUID(),
            name: expect.any(String),
            createdBy: expect.any(String),
            createdByEmail: expect.any(String),
            status: expect.stringMatching(/Open|Closed/)
          })
        );
      });
    });
  });

  describe("Get playes of poker", () => {
    let pokerCreated = null;

    beforeAll(async () => {
      pokerCreated = await factories.create("pokers", {
        createdBy: userFactory.id
      });

      const idPoker = pokerCreated.id;

      const usersCreated = await factories.createMany("users", 3);

      await Promise.all(
        usersCreated.map(
          async ({ id: idUser }) =>
            await factories.create("pokerUsers", { idPoker, idUser })
        )
      );
    });
    it("should be able find all players that play a poker", async () => {
      const response = await request(app)
        .get(`/api/poker/${pokerCreated.id}/playersByPoker`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response).toHaveProperty("body", expect.any(Array));
      expect(response.body.length).toBe(3);
      response.body.forEach((row) => {
        expect(row).toStrictEqual(
          expect.objectContaining({
            name: expect.any(String),
            email: expect.any(String)
          })
        );
      });
    });
  });

  describe("Close poker", () => {
    it("should be able close a poker", async () => {
      const pokerCreated = await factories.create("pokers", {
        createdBy: userFactory.id,
        status: "Open"
      });

      const response = await request(app)
        .put(`/api/poker/${pokerCreated.id}/closePoker`)
        .set({ Authorization: `Bearer ${token}` });

      expect(response.status).toBe(200);
      expect(response).toHaveProperty('body', expect.objectContaining({
        updateId: pokerCreated.id
      }))
    });
  });


  describe('Get stories ok poker', () => {
    it.todo('should be able find all stories that belongs to poker');
  });
  
  describe('Delete poker', () => {
    it.todo('should be able deleta a poker');
  });

});
