const db = require("../db/connection");
const { fetchReviewById } = require("./reviews.model");

exports.fetchCommentsByReviewId = (reviewId) => {
  return db
    .query(
      `
    SELECT comment_id, votes, created_at, author, body, review_id 
    FROM comments 
    WHERE review_id = $1
    ORDER BY created_at DESC;
    `,
      [reviewId]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return [rows];
      } else {
        return Promise.all([rows, fetchReviewById(reviewId)]);
      }
    })
    .then(([comments]) => {
      return comments;
    });
};

exports.addComment = (reviewId, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (review_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [reviewId, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
