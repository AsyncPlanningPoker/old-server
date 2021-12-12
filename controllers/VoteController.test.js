require("../utils/tests/jest/extends");
const request = require("supertest");

const app = require("../app");
const fakers = require("../utils/tests/fakers");
const factories = require("../utils/tests/factories");
const { generateToken } = require("../utils");
const db = require("../database/models");

const Round = db.rounds;
const Vote = db.votes;

let token = null;
let userFactory = null;

beforeAll(async () => {
  userFactory = await factories.create("users");

  token = generateToken(userFactory);
});

describe("Vote controller", () => {
  describe("Create a vote", () => {
    it("should be able create a vote", async () => {
      const pokerCreated = await factories.create("pokers", {
        status: "Open",
        createdBy: userFactory.id
      });

      const pokerUserCreated  = await factories.create("pokerUsers", {
        idUser: userFactory.id,
        idPoker: pokerCreated.id
      });

      const storyCreated = await factories.create("stories", {
        idPoker: pokerCreated.id
      });

      const round = await Round.findOne({
        where: { idStory: storyCreated.id }
      });

      const vote = await Vote.findOne({
        where: {
          idRound: round.id,
          idPokerUser: pokerUserCreated.id
        }
      })

      const response = await request(app)
        .put(`/api/vote/${vote.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send({
          voteNumber: "1",
          voteComment: "test",
        });


      expect(response.status).toBe(200);
      expect(response).toHaveProperty(
        "body",
        expect.objectContaining({
          success: true,
          data: expect.any(Array)
        })
      );
    });
  });

});
