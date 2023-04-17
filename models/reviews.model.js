const db = require("../db/connection");

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
