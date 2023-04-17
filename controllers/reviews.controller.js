const { fetchReviewById } = require("../models/reviews.model");

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
