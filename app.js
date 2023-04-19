const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  getReviews,
  patchReviewVote,
} = require("./controllers/reviews.controller");
const {
  getCommentsById,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { psqlError } = require("./errors/psql.error");
const { customError } = require("./errors/custom.error");
const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api/users", getUsers);
app.get("/api/categories", getCategories);
app.get("/api/reviews/:reviewId/comments", getCommentsById);
app.post("/api/reviews/:reviewId/comments", postComment);
app.get("/api/reviews/:reviewId", getReviewById);
app.patch("/api/reviews/:reviewId", patchReviewVote);
app.get("/api/reviews", getReviews);
app.delete("/api/comments/:commentId", deleteComment);

app.use(customError);
app.use(psqlError);

module.exports = app;
