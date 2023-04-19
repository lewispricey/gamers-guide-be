const request = require("supertest");
const sorted = require("jest-sorted");
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

describe("/api/reviews", () => {
  describe("GET", () => {
    test("200 - returns an array of review objects sorted date desc", async () => {
      const { status, body } = await request(app).get("/api/reviews");

      expect(status).toBe(200);
      expect(body.reviews.length).toBe(13);
      body.reviews.forEach((review) => {
        expect(review).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
      });
      expect(body.reviews).toBeSortedBy("created_at", { descending: true });
    });
  });
});

describe("/api/reviews/:reviewId", () => {
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

    test("404 - returns an error when passed a non-existent ID", async () => {
      const { status, body } = await request(app).get("/api/reviews/1000");

      expect(status).toBe(404);
      expect(body.error).toBe("not found");
    });

    test("400 - returns an error when passed an invalid ID", async () => {
      const { status, body } = await request(app).get("/api/reviews/banana");

      expect(status).toBe(400);
      expect(body.error).toBe("invalid id");
    });
  });

  describe("PATCH", () => {
    test("200 - returns the updated review with the votes increased", async () => {
      const patchBody = { inc_votes: 1 };
      const { status, body } = await request(app)
        .patch("/api/reviews/1")
        .send(patchBody);

      expect(status).toBe(200);
      expect(body.review.votes).toBe(2);
    });

    test("200 - returns the updated review with the votes decreased", async () => {
      const patchBody = { inc_votes: -1 };
      const { status, body } = await request(app)
        .patch("/api/reviews/1")
        .send(patchBody);

      expect(status).toBe(200);
      expect(body.review.votes).toBe(1);
    });

    test("400 - returns an error when missing a inc_votes body", async () => {
      const patchBody = { vote: 1 };
      const { status, body } = await request(app)
        .patch("/api/reviews/1")
        .send(patchBody);

      expect(status).toBe(400);
      expect(body.error).toBe("missing required field(s)");
    });

    test("400 - returns an error when passed an invalid id", async () => {
      const patchBody = { inc_votes: 1 };
      const { status, body } = await request(app)
        .patch("/api/reviews/banana")
        .send(patchBody);

      expect(status).toBe(400);
      expect(body.error).toBe("invalid id");
    });

    test("404 - returns an error when passed an none-existent id", async () => {
      const patchBody = { inc_votes: 1 };
      const { status, body } = await request(app)
        .patch("/api/reviews/1000")
        .send(patchBody);

      expect(status).toBe(404);
      expect(body.error).toBe("not found");
    });
  });
});

describe("/api/reviews/:reviewId/comments", () => {
  describe("GET", () => {
    test("200 - returns an array of comments sorted by date desc", async () => {
      const { status, body } = await request(app).get(
        "/api/reviews/2/comments"
      );

      expect(status).toBe(200);
      expect(body.comments.length).toBe(3);
      body.comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            review_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
          })
        );
      });
      expect(body.comments).toBeSortedBy("created_at", { descending: true });
    });

    test("200 - returns an empty array for an id with no comments", async () => {
      const { status, body } = await request(app).get(
        "/api/reviews/1/comments"
      );

      expect(status).toBe(200);
      expect(Array.isArray(body.comments)).toBe(true);
      expect(body.comments.length).toBe(0);
    });

    test("400 - returns an error when passed an invalid ID", async () => {
      const { status, body } = await request(app).get(
        "/api/reviews/banana/comments"
      );

      expect(status).toBe(400);
      expect(body.error).toBe("invalid id");
    });

    test("404 - returns an error when passed a none-existent id", async () => {
      const { status, body } = await request(app).get(
        "/api/reviews/100/comments"
      );

      expect(status).toBe(404);
      expect(body.error).toBe("not found");
    });
  });
  describe("POST", () => {
    test("201 - returns the new comment", async () => {
      const postBody = { username: "mallionaire", body: "Awesome game!!" };
      const { status, body } = await request(app)
        .post("/api/reviews/2/comments")
        .send(postBody);

      expect(status).toBe(201);
      expect(body.comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          review_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
          author: "mallionaire",
          body: "Awesome game!!",
        })
      );
    });

    test("400 - returns an error when the request body is missing a required field", async () => {
      const postBody1 = { username: "mallionaire" };
      const postBody2 = { body: "Awesome game!!" };

      const { status: status1, body: body1 } = await request(app)
        .post("/api/reviews/100/comments")
        .send(postBody1);

      expect(status1).toBe(400);
      expect(body1.error).toEqual("missing required field(s)");

      const { status: status2, body: body2 } = await request(app)
        .post("/api/reviews/100/comments")
        .send(postBody2);

      expect(status2).toBe(400);
      expect(body2.error).toEqual("missing required field(s)");
    });

    test("404 - returns an error when passed a none-existent id", async () => {
      const postBody = { username: "mallionaire", body: "Awesome game!!" };
      const { status, body } = await request(app)
        .post("/api/reviews/100/comments")
        .send(postBody);

      expect(status).toBe(404);
      expect(body.error).toEqual("not found");
    });

    test("404 - returns an error when passed an invalid username", async () => {
      const postBody = { username: "testuser", body: "Awesome game!!" };
      const { status, body } = await request(app)
        .post("/api/reviews/1/comments")
        .send(postBody);

      expect(status).toBe(404);
      expect(body.error).toEqual("not found");
    });
  });
});

describe("/api/comments/:commentId", () => {
  describe("DELETE", () => {
    test("204 - Success when passed a commentId that exists", async () => {
      const { status } = await request(app).delete("/api/comments/2");
      expect(status).toBe(204);
    });

    test("400 - returns an error when passed an invaid id", async () => {
      const { status, body } = await request(app).delete(
        "/api/comments/bannana"
      );
      expect(status).toBe(400);
      expect(body.error).toBe("invalid id");
    });

    test("404 - returns an error when passed non-existent id", async () => {
      const { status, body } = await request(app).delete("/api/comments/1000");
      expect(status).toBe(404);
      expect(body.error).toBe("not found");
    });
  });
});

describe("/api/users", () => {
  test("200 - returns an array of user objects", async () => {
    const { status, body } = await request(app).get("/api/users");

    expect(status).toBe(200);
    expect(body.users.length).toBe(4);
    body.users.forEach((review) => {
      expect(review).toEqual(
        expect.objectContaining({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        })
      );
    });
  });
});
