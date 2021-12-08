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

describe("Story controller", () => {
  describe("Create a story", () => {
    it("should be able create a story", async () => {
      const pokerCreated = await factories.create("pokers", {
        status: "Open",
        createdBy: userFactory.id
      });

      const payload = fakers.storyFaker({ idPoker: pokerCreated.id });

      const response = await request(app)
        .post("/api/story")
        .set({ Authorization: `Bearer ${token}` })
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          success: true,
          id: expect.toBeUUID()
        })
      );
    });
  });

  describe("Get story by id", () => {
    it("should be able get story given your id", async () => {
      const storyCreated = await factories.create("stories");

      const response = await request(app)
        .get(`/api/story/${storyCreated.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "data",
        expect.objectContaining({
          id: expect.toBeUUID(),
          idPoker: expect.toBeUUID(),
          name: expect.any(String),
          description: expect.any(String)
        })
      );
    });
  });

  describe("Get rounds of story", () => {
    it("should be able find all rounds that belongs to a story", async () => {
      const pokerCreated = await factories.create("pokers", {
        status: "Open",
        createdBy: userFactory.id
      });

      await factories.create("pokerUsers", {
        idUser: userFactory.id,
        idPoker: pokerCreated.id
      });

      const storyCreated = await factories.create("stories", {
        idPoker: pokerCreated.id
      });

      const response = await request(app)
        .get(`/api/story/${storyCreated.id}/rounds`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response).toHaveProperty("body", expect.any(Array));
      response.body.forEach((row) => {
        expect(row).toStrictEqual(
          expect.objectContaining({
            id: expect.toBeUUID(),
            roundNumber: expect.any(Number),
            status: expect.stringMatching(/Open|Closed/),
            idStory: expect.toBeUUID(),
            allPokerUsers: expect.any(Array),
          })
        );
      });
    });
  });

  describe("Delete story", () => {});
});
