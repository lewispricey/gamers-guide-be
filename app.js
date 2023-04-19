const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  getReviews,
} = require("./controllers/reviews.controller");
const {
  getCommentsById,
  postComment,
} = require("./controllers/comments.controller");
const { psqlError } = require("./errors/psql.error");
const { customError } = require("./errors/custom.error");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:reviewId/comments", getCommentsById);
app.post("/api/reviews/:reviewId/comments", postComment);
app.get("/api/reviews/:reviewId", getReviewById);
app.get("/api/reviews", getReviews);

app.use(customError);
app.use(psqlError);

module.exports = app;
