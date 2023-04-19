const db = require("../db/connection");

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, title, category, reviews.designer, reviews.created_at, reviews.votes, reviews.review_img_url, COUNT(comment_id)::int AS comment_count
      FROM reviews 
      LEFT OUTER JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchReviewById = (reviewId) => {
  return db
    .query(`SELECT * from reviews WHERE review_id = $1`, [reviewId])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ code: 404, msg: "not found" });
      }
      return rows[0];
    });
};
