exports.checkSortBy = (sort) => {
  const validSortQuerys = [
    "title",
    "review_id",
    "category",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];

  if (validSortQuerys.includes(sort)) {
    return sort;
  } else {
    return "created_at";
  }
};

exports.checkOrder = (order) => {
  const orderQuery = order.toUpperCase();
  if (orderQuery === "ASC" || orderQuery === "DESC") {
    return orderQuery;
  } else {
    return "DESC";
  }
};
