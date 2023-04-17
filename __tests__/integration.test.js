const request = require("supertest");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");

beforeAll(() => seedDB(data));
afterAll(() => db.end());

describe("/api/categories", () => {
  describe("GET", () => {
    test("200 - Returns an array of category objects on the key of categories", async () => {
      const { status, body } = await request(app).get("/api/categories");
      expect(status).toBe(200);
      expect(body.categories.length).toBe(4);
      body.categories.forEach((category) => {
        expect(category).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
    });
  });
});
