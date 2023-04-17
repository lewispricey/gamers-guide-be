exports.psqlError = (error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ error: "invalid review id" });
  }
  next(error);
};
