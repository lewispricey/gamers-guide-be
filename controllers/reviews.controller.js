const { fetchReviewById, fetchReviews } = require("../models/reviews.model");

exports.getReviews = (request, response, next) => {
  fetchReviews().then((reviews) => {
    response.status(200).send({ reviews });
  });
};

exports.getReviewById = (request, response, next) => {
  const { reviewId } = request.params;
  fetchReviewById(reviewId)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
