const db = require("../db/connection");
const { checkSortBy, checkOrder } = require("../utils/validate-querys");

const checkCategory = (category) => {
  return db
    .query("SELECT * FROM categories WHERE slug=$1", [category])
    .then(({ rows }) => {
      if (!rows[0]) {
        return "";
      } else {
        return `WHERE category=\'${category}\'`;
      }
    });
};

exports.fetchReviews = async (sort, order = "DESC", category) => {
  const sortBy = checkSortBy(sort);
  const orderBy = checkOrder(order);

  let categoryFilter = "";

  if (category) {
    categoryFilter = await checkCategory(category);
  }

  let queryString = `SELECT reviews.review_id, title, category, reviews.designer, reviews.created_at, reviews.votes, reviews.review_img_url, COUNT(comment_id)::int AS comment_count
  FROM reviews 
  LEFT OUTER JOIN comments ON reviews.review_id = comments.review_id
  ${categoryFilter}
  GROUP BY reviews.review_id
  ORDER BY ${sortBy} ${orderBy};`;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (reviewId) => {
  return db
    .query(
      `
    SELECT reviews.review_id, reviews.title, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comment_id)::int AS comment_count
    from reviews 
    LEFT OUTER JOIN comments ON reviews.review_id = comments.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id
      `,
      [reviewId]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ code: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.updateReviewVote = (reviewId, votes) => {
  return db
    .query(
      `
    UPDATE reviews 
    SET votes=votes+$1 
    WHERE review_id=$2 
    RETURNING *;
    `,
      [votes, reviewId]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ code: 404, msg: "not found" });
      } else {
        return rows[0];
      }
    });
};
