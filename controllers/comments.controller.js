const {
  fetchCommentsByReviewId,
  addComment,
} = require("../models/comments.model");

exports.getCommentsById = (request, response, next) => {
  const { reviewId } = request.params;
  fetchCommentsByReviewId(reviewId)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postComment = (request, response, next) => {
  const { reviewId } = request.params;
  const { username, body } = request.body;

  addComment(reviewId, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
