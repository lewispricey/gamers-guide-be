const request = require("supertest");
const seedDB = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");

beforeAll(() => seedDB(data));
afterAll(() => db.end());

describe("/api/categories", () => {
  describe("GET", () => {
    test("200 - returns an array of category objects", async () => {
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

describe("/api/reviews/:reviewID", () => {
  describe("GET", () => {
    test("200 - returns the requested review", async () => {
      const { status, body } = await request(app).get("/api/reviews/1");
      expect(status).toBe(200);
      expect(body.review).toEqual(
        expect.objectContaining({
          review_id: expect.any(Number),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        })
      );
    });
    test("404 - returns an error when passed an non-existent ID", async () => {
      const { status, body } = await request(app).get("/api/reviews/1000");
      expect(status).toBe(404);
      expect(body.error).toBe("not found");
    });
    test("400 - returns an error when passed an invalid ID", async () => {
      const { status, body } = await request(app).get("/api/reviews/banana");
      expect(status).toBe(400);
      expect(body.error).toBe("invalid review id");
    });
  });
});
