const request = require("supertest");
const uuid = require("uuid");

const app = require("../app");
const fakers = require("../utils/tests/fakers");
const factories = require("../utils/tests/factories");
const { generateToken } = require("../utils");

describe("Auth middleware", () => {
  let userCreated = null;
  let token = null;

  beforeAll(async () => {
    userCreated = await factories.create("users");

    token = generateToken(userCreated);
  });

  describe("Get user by id to test middleware auth", () => {
    it("should return status code 401 when set authorization header to empty", async () => {
      const response = await request(app)
        .get(`/api/users/${userCreated.id}`)
        .set("authorization", '');

      const expectedObject = {
        error: true,
        errorMessage: "Missing authorization token"
      };

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject(expectedObject);
    });

    it("should return status code 401 when set authorization header with invalid token", async () => {
      const response = await request(app)
        .get(`/api/users/${userCreated.id}`)
        .set("Authorization", `Bearer invalid_token`);

      const expectedObject = {
        error: true,
        errorMessage: "Invalid Token"
      };

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject(expectedObject);
    });
  });
});
