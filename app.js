const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller");
const { psqlError } = require("./errors/psql.error");
const { customError } = require("./errors/custom.error");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews/:reviewId", getReviewById);

app.use(customError);
app.use(psqlError);

module.exports = app;
